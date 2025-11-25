import './NewCollection.css';
import Item from '../items/Item';
import { useState, useEffect } from 'react';

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);

  const BASE_URL = "https://backend-om60.onrender.com";

  useEffect(() => {
    fetch(`${BASE_URL}/newcollection`)
      .then((response) => response.json())
      .then((data) => setNew_collection(data));
  }, []); // ✅ Prevents infinite renders

  return (
    <>
      <div className="new-collections">
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className="collections">
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
  );
};

export default NewCollections;
