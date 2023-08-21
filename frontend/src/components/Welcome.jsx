import React from "react";
import Header from "./Header";

const Welcome = () => {
  return (
    <>
    <Header />
    <div className="container py-5">
      <header className="text-center mb-4">
        <h1>Welcome to AI Storyteller</h1>
        <p className="lead">
          A platform where AI generates amazing stories for you!
        </p>
      </header>
      <section className="row justify-content-center">
        <div className=" text-center col-md-6">
          <h2 className="text-center">Share Your Story!!</h2>
          <button
            onClick={() => {
              location.href="http://localhost:3006/user"
            }}
            className="text-center btn btn-success"
          >
            Checkout !!
          </button>
        </div>
      </section>
    </div>
    </>
  );
};

export default Welcome;
// 