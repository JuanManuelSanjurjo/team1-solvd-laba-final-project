"use client";

import React from "react";
import { useState } from "react";
import { Divider, useMediaQuery, useTheme } from "@mui/material";
import CartCard from "./components/CartCard";
import { redirect } from "next/navigation";

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cartIsEmpty = cartItems.length === 0;

  if (cartIsEmpty) {
    redirect("/cart/empty");
  }

  if (cartItems.length > 0)
    return (
      <>
        {cartItems.map((item) => (
          <React.Fragment key={item.id}>
            <CartCard
              price={item.price}
              stock={item.stock}
              gender={item.gender}
              quantity={item.quantity}
              productTitle={item.title}
              image={item.image}
            />
            {!isMobile && <Divider />}
          </React.Fragment>
        ))}
      </>
    );
}
