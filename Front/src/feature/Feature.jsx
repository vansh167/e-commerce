import React from "react";
import "./feature.css";

// Import images from src
import f1 from "../assets/features/f1.png";
import f2 from "../assets/features/f2.png";
import f3 from "../assets/features/f3.png";
import f4 from "../assets/features/f4.png";
import f5 from "../assets/features/f5.png";
import f6 from "../assets/features/f6.png";

const Feature = () => {
  const features = [
    { img: f1, title: "Free Shipping" },
    { img: f2, title: "Online Order" },
    { img: f3, title: "Save Money" },
    { img: f4, title: "Offers" },
    { img: f5, title: "Promotions" },
    { img: f6, title: "Happy Sell" },
  ];

  return (
    <section id="feature" className="section-p1">
      {features.map((feature, index) => (
        <div className="fe-box" key={index}>
          <img src={feature.img} alt={feature.title} />
          <h6>{feature.title}</h6>
        </div>
      ))}
    </section>
  );
};

export default Feature;
