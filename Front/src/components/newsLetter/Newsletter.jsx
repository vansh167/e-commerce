import React from "react";
import "./Newsletter.css";

const Newsletter = () => {
  return (
    <section className="newsletter">
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>

      <div className="newsletter__form">
        <input type="email" placeholder="Your Email id" />
        <button>Subscribe</button>
      </div>
    </section>
  );
};

export default Newsletter;
