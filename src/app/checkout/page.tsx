"use client"
import { useState } from "react";

import CartCard from "./components/CartCard";

export default function Checkout() {
  function addItem () {
    console.log("Adding item")
  }

  function restItem () {
    console.log("Resting item")
  }


const [cartItems, setCartItems] = useState([
  { id: 1, title: "Product 1", price: 1000, quantity: 2 },
  { id: 2, title: "Product 2", price: 2500, quantity: 1 },
]);

  return (
    <div>
      <h1>Checkout Page</h1>

      {cartItems.map((item)=>(
      <CartCard key={item.id} quantity={item.quantity} handleAdd={addItem} handleRest={restItem}/>

      ))}

    </div>
  );
}
