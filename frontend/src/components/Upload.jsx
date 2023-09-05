import React, { useState } from "react";
import Header from "./Header";
import axios from 'axios';

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const api_key = "215246828679776";
  const cloud_name = "dcrchug4p";

  const handleChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFile) {
      try {
        setUploadProgress(0);
        const signatureResponse = await axios.get("/get-signature");
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("api_key", api_key);
        data.append("signature", signatureResponse.data.signature); 
        data.append("timestamp", signatureResponse.data.timestamp);
        const cloudinaryResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
            data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: function(e) {
                    setUploadProgress(e.loaded / e.total);
                },
            }
        );
        console.log(cloudinaryResponse.data);

        const photoData = {
            public_id: cloudinaryResponse.data.public_id,
            version: cloudinaryResponse.data.version,
            signature: cloudinaryResponse.data.signature,
        };
        
        axios.post("/do-something-with-photo", photoData)
        .then((response) => {
          if (response.data.success) {
            window.location.href = "http://localhost:3006/app";
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
      

      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  return (
    <div className="desktop1">
      <Header />
      <div className="frame">
        <div className="uploadYourImagesParent text-center">
          <p className="uploadYourImages">Upload your images</p>
          <p className="pngAndJpg">PNG and JPG files are allowed</p>
          {uploadProgress > 0 && (
            <div>
              Uploading... {Math.round(uploadProgress * 100)}%
            </div>
          )}
        </div>
        <div className="rectangleParent">
          <form
            id="upload-form"
            method="POST"
            action="http://localhost:3000/upload-photo"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <input
              id="file-field"
              className="frameChild"
              type="file"
              name="file"
              required
              accept=".jpg,.png"
              multiple={false}
              onChange={handleChange}
            />
            <button className="submitBtn" type="submit">
              Submit
            </button>
          </form>
          <p className="dragAndDrop">
            Drag and drop or browse to choose a file
          </p>
          <img className="groupIcon" alt="" src="/upload-button.svg" />
        </div>
      </div>
    </div>
  );
}

export default Upload;
