// src/components/items/Item.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Item.css';

// change this to a single exported config if you prefer
const BASE_URL = 'https://backend-om60.onrender.com';

/**
 * Normalize image paths:
 * - If falsy -> return empty string (you can show a placeholder instead)
 * - If already absolute (http/https) -> rewrite localhost origin -> return
 * - If relative (starts with / or not) -> prepend BASE_URL
 */
const normalizeImageUrl = (img) => {
  if (!img) return '';

  // If the backend accidentally returns absolute localhost URLs, rewrite them:
  // e.g. "http://localhost:4000/image/..." -> "https://backend-om60.onrender.com/image/..."
  const rewrittenLocalhost = img.replace(/^http:\/\/localhost:4000/i, BASE_URL);

  // If it's now an absolute URL (http or https) return it
  if (/^https?:\/\//i.test(rewrittenLocalhost)) return rewrittenLocalhost;

  // If it starts with a slash -> join directly
  if (rewrittenLocalhost.startsWith('/')) return `${BASE_URL}${rewrittenLocalhost}`;

  // Otherwise treat as relative
  return `${BASE_URL}/${rewrittenLocalhost}`;
};

const Item = ({ id, name, image, new_price, old_price }) => {
  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const imgSrc = normalizeImageUrl(image);
  const altText = name || 'Product Image';

  return (
    <div className="item">
      <Link to={`/product/${id}`} onClick={handleClick}>
        <div className="item-image-container">
          {/* If you want a placeholder when missing, replace imgSrc || '/assets/placeholder.png' */}
          <img src={imgSrc || ''} alt={altText} loading="lazy" />
        </div>
      </Link>

      <p className="item-name">{name}</p>

      <div className="item-prices">
        <span className="new-price">
          ₹{Number(new_price || 0).toLocaleString('en-IN')}
        </span>
        <span className="old-price">
          ₹{Number(old_price || 0).toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
};

export default Item;
