import React, { useState } from "react";
import "./Productdisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { useShopContext } from "../../context/ShopContext";

const BASE_URL = "https://backend-om60.onrender.com";

const fixImageUrl = (url) => {
  if (!url) return "";

  // 1) If backend returned an absolute localhost URL, rewrite to deployed URL
  let u = url.replace(/^http:\/\/localhost:4000/i, BASE_URL);

  // 2) If it already is a full URL (http/https) return as-is
  if (/^https?:\/\//i.test(u)) return u;

  // 3) If it already starts with BASE_URL (avoid double prefix)
  if (u.startsWith(BASE_URL)) return u;

  // 4) If it starts with a slash, join directly
  if (u.startsWith("/")) return `${BASE_URL}${u}`;

  // 5) Otherwise treat it as a relative path
  return `${BASE_URL}/${u}`;
};

const Productdisplay = ({ product }) => {
  const { addToCart } = useShopContext();
  const [zoom, setZoom] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    setCoords({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  if (!product) return <div>Loading...</div>; // Safe fallback

  const fixedImage = fixImageUrl(product.image);

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={fixedImage} alt="" />
          <img src={fixedImage} alt="" />
          <img src={fixedImage} alt="" />
          <img src={fixedImage} alt="" />
        </div>

        <div
          className="productdisplay-img"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            className="productdisplay-main-img"
            src={fixedImage}
            alt={product.name}
          />

          {zoom && (
            <div
              className="zoomed-image"
              style={{
                backgroundImage: `url(${fixedImage})`,
                backgroundPosition: `${coords.x}% ${coords.y}%`,
              }}
            />
          )}
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>

        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_dull_icon} alt="star" />
          <p>(122)</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            ₹{product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            ₹{product.new_price}
          </div>
        </div>

        <div className="productdisplay-right-description">
          Allen Solly Men's Cotton Regular Fit Polo T-Shirt
        </div>

        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div>S</div>
          <div>M</div>
          <div>L</div>
          <div>XL</div>
          <div>XXL</div>
        </div>

        <button onClick={() => addToCart(product.id)}>ADD TO CART</button>

        <p className="productdisplay-right-category">
          <span>Category :</span> Women , T-Shirt, Crop Top
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default Productdisplay;
