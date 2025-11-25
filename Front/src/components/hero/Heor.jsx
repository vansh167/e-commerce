import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import heroImg from "../../assets/features/hero4.png";
import buttonImg from "../../assets/features/button.png";

const Hero = () => {
  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${heroImg})`,   // Use imported image
      }}
    >
      <div className="container">
        <h3>Trade-in-offer</h3>
      </div>

      <h2>
        <div style={{ marginBottom: "-60px" }}>Super value deals</div>
      </h2>
<br/>
<br/>

      <h1 >
        <div style={{ color: "#088178" }}>On all Products</div>
      </h1>

      <p>Save More with coupons & up to 70% off</p>

      {/* Hero Button */}
      <Link
        to="/new-collections"
        className="hero-btn"
        style={{
          backgroundImage: `url(${buttonImg})`,  // Use imported button image
        }}
      >
        Latest Collection
      </Link>
    </div>
  );
};

export default Hero;
