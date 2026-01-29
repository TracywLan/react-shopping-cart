// src/components/Shop/Shop.jsx

// components
import InventoryList from '../../components/InventoryList/InventoryList';
// data
import { inventoryData } from '../../data/data';
import './Shop.css'
import { useState } from 'react';

const Shop = () => {
  const [shopInventory, setShopInventory] = useState(inventoryData);
  const [userInventory, setUserInventory] = useState([]);
  const [message, setMessage] = useState('')

  const handleClearInventory = () => {
    setUserInventory([]);
    setShopInventory(inventoryData);
    setMessage['']
  };

  const handleAddItem = (item) => {
    // Check if shop has stock available
    // We assume your data objects have a 'quantity' property
    if (item.quantity <= 0) return setMessage('Out of stock'); 

    // 1. Reduce quantity in Shop Inventory
    const newShopInventory = shopInventory.map((shopItem) => {
      if (shopItem._id === item._id) {
        // Return a new object with decremented quantity
        return { ...shopItem, quantity: shopItem.quantity - 1 };
      }
      return shopItem;
    });
    setShopInventory(newShopInventory);

    // 2. Add to User Inventory
    // Check if item is already in the cart
    const existingItem = userInventory.find((cartItem) => cartItem._id === item._id);

    if (existingItem) {
      // If it exists update the quantity
      const newUserInventory = userInventory.map((cartItem) => {
        if (cartItem._id === item._id) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });
      setUserInventory(newUserInventory);
    } else {
      // If it is new add it with quantity 1
      // We ensure the new object is separate from the shop object
      setUserInventory([...userInventory, { ...item, quantity: 1 }]);
    }
    
    setMessage('');
  };

  const handleRemoveItem = (item) => {
    // 1. Add stock back to Shop Inventory
    const newShopInventory = shopInventory.map((shopItem) => {
      if (shopItem._id === item._id) {
        return { ...shopItem, quantity: shopItem.quantity + 1 };
      }
      return shopItem;
    });
    setShopInventory(newShopInventory);

    // 2. Remove or Decrement from User Inventory
    if (item.quantity > 1) {
      // If quantity is greater than 1 just decrement
      const newUserInventory = userInventory.map((cartItem) => {
        if (cartItem._id === item._id) {
          return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
        return cartItem;
      });
      setUserInventory(newUserInventory);
    } else {
      // If quantity is 1 remove it entirely
      setUserInventory(userInventory.filter((el) => el._id !== item._id));
    }
  };

  return (
    <main>
      <h1>Shop</h1>
      <h2>{message}</h2>
      <button onClick={handleClearInventory}>Reset</button>
      <section className='shop-section'>
        <InventoryList 
          title="Shop Inventory" 
          inventory={shopInventory} 
          handleAddItem={handleAddItem}
        />
        <InventoryList 
          title='User Inventory' 
          inventory={userInventory}
          handleRemoveItem={handleRemoveItem}
        />
      </section>
    </main>
  );
}

export default Shop;