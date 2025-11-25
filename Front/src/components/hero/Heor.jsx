import React from 'react'
import { Link } from "react-router-dom";
import './Hero.css'

const Hero = () => {
  return (
    <div className="hero">
      <div className="container">
        <br /><br /><br /><br /><br />
        <h3>Trade-in-offer</h3>
      </div>

      <h2>
        <div style={{ marginBottom: "-60px" }}>Super value deals</div>
        <br />
      </h2>

      <h1>
        <div style={{ color: "#088178" }}>On all Products</div>
      </h1>

      <p>Save More with coupons & up to 70% off</p>

      {/* ⭐ CLICKABLE BUTTON */}
      <Link to="/new-collections" className="hero-btn">
        Latest Collection
      </Link>
    </div>
  )
}

export default Hero
