import React, { useState, useEffect } from 'react'
import './Popular.css'
import Item from '../items/Item'

const Popular = () => {
  const [popularProduct, setPopularProduct] = useState([]);

  const BASE_URL = "https://backend-om60.onrender.com";

  useEffect(() => {
    fetch(`${BASE_URL}/productinwomen`)
      .then((response) => response.json())
      .then((data) => setPopularProduct(data));
  }, []);

  return (
    <>
      <div className="popular">
        <h1>POPULAR IN WOMEN</h1>
        <hr />
        <div className="popular-item">
          {
            popularProduct.map((item, i) => {
              return (
                <Item 
                  key={i} 
                  id={item.id} 
                  name={item.name} 
                  image={item.image} 
                  new_price={item.new_price} 
                  old_price={item.old_price} 
                />
              );
            })
          }
        </div>
      </div>
    </>
  )
}

export default Popular
