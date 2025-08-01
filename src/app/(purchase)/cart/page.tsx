"use client";

import React from "react";
import { useState } from "react";
import { Typography, Divider, Box } from "@mui/material";
import CartCard from "./components/CartCard";
import Button from "@/components/Button";

/**
 * Checkout page component that displays a list of products in the cart.
 * Each product can have its quantity increased or decreased using the provided handlers.
 *
 * @component
 * @returns {JSX.Element} The rendered checkout page with cart items or an empty state.
 */

export default function Checkout() {
  const [cartItems] = useState([
    {
      id: 1,
      title: "Product 1",
      price: 1000,
      quantity: 2,
      gender: "Women",
      stock: true,
      image:
        "https://www.opensports.com.ar/media/catalog/product/cache/4cbe9863fc1e4aa316955fdd123a5af3/I/H/IH2636_0.jpg",
    },
    {
      id: 2,
      title: "Product 2",
      price: 2500,
      quantity: 1,
      gender: "Men",
      stock: true,
      image:
        "https://www.opensports.com.ar/media/catalog/product/cache/4cbe9863fc1e4aa316955fdd123a5af3/I/H/IH2636_0.jpg",
    },
  ]);

  return (
    <>
      <Box sx={{ marginTop: "80px" }}>
        <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 45 } }}>
          Cart
        </Typography>

        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <CartCard
                price={item.price}
                stock={item.stock}
                gender={item.gender}
                quantity={item.quantity}
                productTitle={item.title}
                image={item.image}
              />
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 200,
            }}
          >
            <Typography variant="body1">The cart is empty</Typography>
            <Button variant="contained">Go back to the store</Button>
          </Box>
        )}
      </Box>
    </>
  );
}
