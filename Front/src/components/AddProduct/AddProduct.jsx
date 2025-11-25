import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: 'women',
    new_price: '',
    old_price: '',
  });

  const BASE_URL = "https://backend-om60.onrender.com";

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    console.log('Sending product:', productDetails);
    let responseData;
    let product = { ...productDetails };

    if (!image) {
      alert("Please select an image before uploading");
      return;
    }

    product.new_price = Number(product.new_price);
    product.old_price = Number(product.old_price);

    let formData = new FormData();
    formData.append('product', image);

    try {
      const uploadResp = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      responseData = await uploadResp.json();

      if (responseData.success) {
        product.image = responseData.image_url;

        const addResp = await fetch(`${BASE_URL}/addproduct`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        let addData;
        try {
          addData = await addResp.json();
          if (addData.success) {
            alert('✅ Product added successfully!');

            setProductDetails({
              name: '',
              image: '',
              category: 'women',
              new_price: '',
              old_price: '',
            });
            setImage(false);
          } else {
            alert('❌ Failed to add product');
          }
        } catch (err) {
          console.error('Error parsing JSON:', err);
          alert('Server error. Check backend logs.');
        }
      }
    } catch (error) {
      alert('Failed to connect to server.');
      console.error(error);
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      <div className="addproduct-thumnial-img">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
            className="addproduct-thumnial-img"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button onClick={Add_Product} className="addproduct-btn">
        Add
      </button>
    </div>
  );
};

export default AddProduct;
