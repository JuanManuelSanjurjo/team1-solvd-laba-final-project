"use client";
import { useState } from "react";

import CartCard from "../cart/components/CartCard";
import { Typography, Divider, Box } from "@mui/material";

export default function Checkout() {
  function addItem() {
    console.log("Adding item");
  }

  function restItem() {
    console.log("Resting item");
  }

  const [cartItems] = useState([
    {
      id: 1,
      title: "Product 1",
      price: 1000,
      quantity: 2,
      gender: "Women",
      stock: true,
    },
    {
      id: 2,
      title: "Product 2",
      price: 2500,
      quantity: 1,
      gender: "Men",
      stock: true,
    },
  ]); //Will have to figure out how to load this from the API

  return (
    <Box sx={{ marginLeft: "196px", marginTop: "80px" }}>
      <Typography variant="h2">Cart</Typography>

      {cartItems.map((item) => (
        <>
          <CartCard
            price={item.price}
            stock={item.stock}
            gender={item.gender}
            key={item.id}
            quantity={item.quantity}
            handleAdd={addItem}
            handleRest={restItem}
            productTitle={item.title}
          />
          <Divider />
        </>
      ))}
    </Box>
  );
}
