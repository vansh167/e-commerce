import React from 'react';
import './CartItems.css';
import { useShopContext } from '../../context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://backend-om60.onrender.com';
const PLACEHOLDER = '/assets/placeholder.png'; // change if you have a local placeholder

// small, resilient image normalizer (handles localhost absolute, absolute external, and relative paths)
const normalizeImageUrl = (img) => {
  if (!img) return PLACEHOLDER;

  // rewrite any absolute localhost URL -> deployed BASE_URL
  let url = img.replace(/^http:\/\/localhost:4000/i, BASE_URL);

  // if already absolute (http(s)://) return it
  if (/^https?:\/\//i.test(url)) return url;

  // if url already starts with BASE_URL, return
  if (url.startsWith(BASE_URL)) return url;

  // leading slash -> join directly
  if (url.startsWith('/')) return `${BASE_URL}${url}`;

  // otherwise treat as relative
  return `${BASE_URL}/${url}`;
};

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } = useShopContext();
  const navigate = useNavigate();

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>

      <hr />

      <div className="cartitems-list">
        {all_product.map((e) => {
          // be resilient: cartItems keys may be numbers or strings
          const qty = cartItems[e.id] ?? cartItems[String(e.id)] ?? 0;
          if (qty > 0) {
            const imgSrc = normalizeImageUrl(e.image);

            return (
              <div key={e.id}>
                <div className="cartitems-format cartitems-format-main">
                  <img
                    src={imgSrc}
                    alt={e.name || 'Product'}
                    className="carticon-product-icon"
                    loading="lazy"
                    decoding="async"
                    onError={(ev) => {
                      if (ev.target.src !== PLACEHOLDER) ev.target.src = PLACEHOLDER;
                    }}
                  />
                  <p>{e.name}</p>
                  <p>₹{e.new_price}</p>
                  <button className="cartitems-quantity">{qty}</button>
                  <p>₹{e.new_price * qty}</p>
                  <img
                    src={remove_icon}
                    alt="Remove"
                    onClick={() => removeFromCart(e.id)}
                    className="cartitems-remove-icon"
                  />
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>₹{getTotalCartAmount()}</h3>
            </div>
          </div>

          <button
            onClick={() => {
              if (localStorage.getItem('auth-token')) {
                navigate('/checkout');
              } else {
                navigate('/login');
              }
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cartitems-promocode">{/* keep placeholder for promo section */}</div>
      </div>
    </div>
  );
};

export default CartItems;
