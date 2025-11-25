import React from "react";
import "./Footer.css";
import appImg from "../../image/app.jpg";
import googleImg from "../../image/play.jpg"; 
import payImg from "../../image/pay.png";
const Footer = () => {
  return (
    <>
      <footer className="footer">
        {/* Column 1 */}
        <div className="col">
          <h4>Contact</h4>
          <p>
            <strong>Address:</strong> 562 Wellington Road, Street 32, San Francisco
          </p>
          <p>
            <strong>Phone:</strong> +01 2222 365 / (+91) 01 2345 6789
          </p>
          <p>
            <strong>Hours:</strong> 10:00 - 18:00, Mon - Sat
          </p>

          <div className="follow">
            <h4>Follow Us</h4>
            <div className="icon">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-pinterest-p"></i>
              <i className="fab fa-youtube"></i>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="col">
          <h4>About</h4>
          <a href="#">About Us</a>
          <a href="#">Delivery Information</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Contact Us</a>
        </div>

        {/* Column 3 */}
        <div className="col">
          <h4>My Account</h4>
          <a href="#">Sign In</a>
          <a href="#">View Cart</a>
          <a href="#">My Wishlist</a>
          <a href="#">Track My Order</a>
          <a href="#">Help</a>
        </div>

        {/* Column 4 */}
        <div className="col install">
          <h4>Install App</h4>
          <p>From App Store or Google Play</p>
          <div className="row">
            <img src={appImg} alt="App Store" />
            <img src={googleImg} alt="Google Play" />
          </div>
          <p>Secured Payment Gateways</p>
          <img src={payImg} alt="Payment Gateways" />

        </div>

        {/* Copyright */}
        <div className="copyright">
          <hr />
          <p>© 2023 - All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;