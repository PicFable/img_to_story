import React, { useState } from "react";
import Header from "./Header";

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("http://localhost:3000/upload-photo", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("File uploaded successfully");
          // Perform any UI updates or actions after successful upload
        } else {
          console.error("Failed to upload file");
          // Handle error cases here
        }
      } catch (error) {
        console.error("An error occurred:", error);
        // Handle network errors here
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