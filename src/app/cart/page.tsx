"use client";
import { useState } from "react";

import CartCard from "../cart/components/CartCard";
import { Typography, Divider, Box } from "@mui/material";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

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
  ]); //Will have to figure out how to load this from the API. This should be a server side component?

  return (
    <Box
      sx={{
        display: "flex",
        marginTop: "80px",
        justifyContent: "space-around",
      }}
    >
      <Box sx={{ marginTop: "80px" }}>
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

      <Box sx={{ marginTop: "80px" }}>
        <CheckoutSummary
          subtotal={140}
          total={140}
          tax={0}
          shipping={0}
          buttonText="Checkout"
        />
      </Box>
    </Box>
  );
}
