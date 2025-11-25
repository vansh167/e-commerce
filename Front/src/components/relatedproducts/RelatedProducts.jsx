import React, { useEffect, useState } from 'react'
import './RelatedProducts.css'
import Item from '../items/Item'

const RelatedProducts = () => {
  const [new_collection, setNew_collection] = useState([]);

  const BASE_URL = "https://backend-om60.onrender.com";

  useEffect(() => {
    fetch(`${BASE_URL}/newcollection`)
      .then((response) => response.json())
      .then((data) => setNew_collection(data));
  }, []); // ✅ Prevent infinite API calls

  return (
    <>
      <div className="relatedproducts">
        <h1>Related Products</h1>
        <hr />
        <div className="relatedproducts-item">
          {new_collection.map((item, i) => {
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
          })}
        </div>
      </div>
    </>
  )
}

export default RelatedProducts
