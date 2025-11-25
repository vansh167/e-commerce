import React from 'react'
import './feature.css' // optional if you style separately

const Feature = () => {
  return (
    <section id="feature" className="section-p1">
      <div className="fe-box">
        <img src="./src//assets/features/f1.png" alt="Free Shipping" />
        <h6>Free Shipping</h6>
      </div>
      <div className="fe-box">
        <img src="./src//assets/features/f2.png" alt="Online Order" />
        <h6>Online Order</h6>
      </div>
      <div className="fe-box">
        <img src="./src//assets/features/f3.png" alt="Save Money" />
        <h6>Save Money</h6>
      </div>
      <div className="fe-box">
        <img src="./src//assets/features/f4.png" alt="Offers" />
        <h6>Offers</h6>
      </div>
      <div className="fe-box">
        <img src="./src//assets/features/f5.png" alt="Promotions" />
        <h6>Promotions</h6>
      </div>
      <div className="fe-box">
        <img src="./src//assets/features/f6.png" alt="Happy Sell" />
        <h6>Happy Sell</h6>
      </div>
    </section>
  )
}

export default Feature;
