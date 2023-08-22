const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const connectToMongo = require("./mongoconnect");
connectToMongo();
app.use(express.json());
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));
let localStorage = require('local-storage');

require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fse = require("fs-extra");
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true,
});

function passwordProtected(req, res, next) {
  res.set("WWW-Authenticate", "Basic realm='Cloudinary Front-end Upload'");
  if (req.headers.authorization == "Basic YWRtaW46YWRtaW4=") {
    next();
  } else {
    res.status(401).send("Try again");
  }
}

// app.use(passwordProtected);

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Welcome</h1>

    <form id="upload-form">
      <input id="file-field" type="file" />
      <button>Upload</button>
    </form>

    <hr />

    <a href="/view-photos">How would I use the public_id values that I store in my database?</a>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="/client-side.js"></script>
  </body>
</html>`);
});

app.get("/get-signature", cors(), (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    cloudinaryConfig.api_secret
  );
  res.json({
    timestamp,
    signature,
  });
});

app.post("/do-something-with-photo", cors(), async (req, res) => {
  // based on the public_id and the version that the (potentially malicious) user is submitting...
  // we can combine those values along with our SECRET key to see what we would expect the signature to be if it was innocent / valid / actually coming from Cloudinary
  const expectedSignature = cloudinary.utils.api_sign_request(
    {
      public_id: req.body.public_id,
      version: req.body.version,
    },
    cloudinaryConfig.api_secret
  );
  // We can trust the visitor's data if their signature is what we'd expect it to be...
  // Because without the SECRET key there's no way for someone to know what the signature should be...
  if (expectedSignature === req.body.signature) {
    // Do whatever you need to do with the public_id for the photo
    // Store it in a database or pass it to another service etc...
    const public_id = req.body.public_id;

    var mainUrl =
      "https://res.cloudinary.com/dcrchug4p/image/upload/w_200,h_100,c_fill,q_100/" +
      public_id +
      ".jpg";
    // To get the title from the picture
    async function query(url) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ url }),
        }
      );
      const result = await response.json();
      return result;
    }
    // To get the story from the title
    async function queryforstory(data) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/aspis/gpt2-genre-story-generation",
        {
          headers: {
            Authorization: "Bearer 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",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result;
    }

    const imageUrl = mainUrl;
    const titleResponse = await query(imageUrl);
    console.log(titleResponse[0].generated_text);
    const title = titleResponse[0].generated_text;
    const storyResponse = await queryforstory(title);
     console.log(storyResponse[0].generated_text);
    const story = storyResponse[0].generated_text;

    const postData = {
      title: title,
      url: public_id,
      story: story,
    };

    try {
      const response = await fetch("http://localhost:3000/stories/poststory", {
        method: "POST",
        headers: {
          "auth-token": localStorage.get("token"), // If authentication is required
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        console.log("Story created successfully");
        // Perform any UI updates or page refresh here
      } else {
        const errorMessage = await response.text();
        console.error("Failed to create story:", errorMessage);
        // Handle error cases here
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle network errors here
    }
  }
});

app.get("/view-photos", cors(), async (req, res) => {
  await fse.ensureFile("data.txt");
  const existingData = await fse.readFile("data.txt", "utf8");
  res.send(`<h1>Hello, here are a few photos...</h1>
  <ul>
  ${existingData
    .split("\n")
    .filter((item) => item)
    .map((id) => {
      return `<li><img src="https://res.cloudinary.com/dcrchug4p/image/upload/w_200,h_100,c_fill,q_100/${id}.jpg">
      <form action="delete-photo" method="POST">
        <input type="hidden" name="id" value="${id}" />
        <button>Delete</button>
      </form>
      </li>
      `;
    })
    .join("")}
  </ul>
  <p><a href="/">Back to homepage</a></p>
  `);
});

app.post("/delete-photo", cors(), async (req, res) => {
  // do whatever you need to do in your database etc...
  await fse.ensureFile("data.txt");
  const existingData = await fse.readFile("data.txt", "utf8");
  await fse.outputFile(
    "data.txt",
    existingData
      .split("\n")
      .filter((id) => id != req.body.id)
      .join("\n")
  );
  cloudinary.uploader.destroy(req.body.id);
  res.redirect("/view-photos");
});


var fileupload = require("express-fileupload");
app.use(fileupload());

app.post("/upload-photo", cors(), async (req, res) => {
  const api_key = "215246828679776";
  const cloud_name = "dcrchug4p";
  const signatureResponse = await fetch("http://localhost:3000/get-signature").then((response) =>
    response.json()
  );
  const data = new FormData();
  data.append("file", req.files);
  data.append("api_key", api_key);
  data.append("signature", signatureResponse.signature);
  data.append("timestamp", signatureResponse.timestamp);
  const cloudinaryResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
    {
      method: "POST",
      body: data,
    }
  ).then((response) => response.json());
  console.log(cloudinaryResponse);

  const photoData = {
    public_id: cloudinaryResponse.public_id,
    version: cloudinaryResponse.version,
    signature: cloudinaryResponse.signature,
  };

  fetch("http://localhost:3000/do-something-with-photo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(photoData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
});

app.listen(3000, () =>
  console.log("> Server is up and running on port : 3000")
);