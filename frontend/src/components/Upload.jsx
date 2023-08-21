import React from "react";
import Header from "./Header";

const handleChange = (e) => {
  console.log(e.target.files[0]);
};

function Upload() {
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
            method="POST"
            action="http://localhost:3000/upload-photo"
            encType="multipart/form-data"
          >
            <input
              id="file-field"
              className="frameChild"
              type="file"
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
// 
export default Upload;
