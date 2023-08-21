import React from "react";
import { useSpring, animated } from "react-spring";

function Card(props) {
  const [isHovered, setHovered] = React.useState(false);
  var someUrl = props.url;
  var mainUrl =
    "https://res.cloudinary.com/dcrchug4p/image/upload/w_200,h_100,c_fill,q_100/" +
    someUrl +
    ".jpg";
  const zoomIn = useSpring({
    transform: isHovered ? "scale(1.05)" : "scale(1)",
  });

  function f() {
    const id = props.id;
    const url = `http://localhost:3000/stories/deletestory/${id}`;
    fetch(url, {
      method: "DELETE",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Story deleted successfully");
          window.location.reload();
        } else {
          console.error("Failed to delete story");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }
// 
  return (
    <animated.div
      className="card m-5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...zoomIn,
        width: "350px",
        margin: "5px",
        cursor: "pointer",
        borderRadius: "10px",
      }}
    >
      <img
        src={mainUrl}
        className="card-img-top"
        alt="..."
        style={{ borderRadius: "10px 10px 0 0" }}
      />
      <div className="card-body">
        <h5 className="card-title font-weight-bold">
          {props.title}
          {/* <i class="fa-solid fa-pen-to-square"></i> */}
        </h5>

        <p className="card-text">{props.content}</p>
        <div className="delete-icon">
          <i onClick={f} className="fa-solid fa-trash fa-xl "></i>
        </div>
      </div>
    </animated.div>
  );
}

export default Card;
