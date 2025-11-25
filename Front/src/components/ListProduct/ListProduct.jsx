import React, { useEffect, useState } from 'react';
import "./ListProduct.css";
import cross_icon from '../../assets/cross_icon.png';

const BASE_URL = "https://backend-om60.onrender.com";
const PLACEHOLDER = '/assets/placeholder.png'; // change if you have a different local placeholder

// Normalize image paths returned by backend
const normalizeImageUrl = (img) => {
  if (!img) return PLACEHOLDER;

  // rewrite localhost absolute urls to deployed base
  let url = String(img).replace(/^http:\/\/localhost:4000/i, BASE_URL);

  // if already absolute (http(s)://) return as-is
  if (/^https?:\/\//i.test(url)) return url;

  // if already starts with BASE_URL (avoid double prefix), return
  if (url.startsWith(BASE_URL)) return url;

  // if path starts with slash -> join directly
  if (url.startsWith('/')) return `${BASE_URL}${url}`;

  // otherwise treat as relative path
  return `${BASE_URL}/${url}`;
};

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const res = await fetch(`${BASE_URL}/allproducts`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setAllProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setAllProducts([]); // fail-safe
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleRemove = async (id) => {
    try {
      await fetch(`${BASE_URL}/removeproduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      // use functional update to avoid stale state
      setAllProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      console.error('Failed to remove product:', err);
    }
  };

  return (
    <div className="list-product">
      <h1>All Product List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        <div className="listproduct-scroll-container">
          {allproducts.map((product) => {
            const imgSrc = normalizeImageUrl(product.image);
            return (
              <div key={product.id ?? product.name} className='listproduct-format'>
                <img
                  src={imgSrc}
                  alt={product.name || 'Product'}
                  className='listproductproduct-image'
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    if (e?.target?.src !== PLACEHOLDER) e.target.src = PLACEHOLDER;
                  }}
                />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img
                  className='listproduct-remove-icon'
                  src={cross_icon}
                  alt="Remove"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRemove(product.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
