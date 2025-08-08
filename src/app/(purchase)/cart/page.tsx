"use client";

import React from "react";
import {
  Divider,
  useMediaQuery,
  useTheme,
  Typography,
  Box,
} from "@mui/material";
import CartCard from "./components/CartCard";
import { useCartStore } from "@/store/cartStore";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import { useRouter } from "next/navigation";

/**
 * Checkout page component that displays a list of products in the cart.
 * Each product can have its quantity increased or decreased using the provided handlers.
 *
 * @component
 * @returns {JSX.Element} The rendered checkout page with cart items or an empty state.
 */

export default function Checkout() {
  const cartItems = useCartStore((state) => state.items);
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cartIsEmpty = cartItems.length === 0;

  console.log("cart: ", cartItems);

  function visitProducts() {
    router.push("/products");
  }

  if (cartIsEmpty) {
    return (
      <Box sx={{ marginTop: "80px", width: "90%", height: "100%" }}>
        <Typography variant="h2">Cart</Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            marginTop: "5rem",
          }}
        >
          <MyProductsEmptyState
            title="You don't have any products yet"
            subtitle="Post can contain video, images and text."
            buttonText="Add Product"
            onClick={visitProducts}
          />
        </Box>
      </Box>
    );
  }

  if (cartItems.length > 0)
    return (
      <>
        <Box sx={{ marginTop: "80px" }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 45 } }}>
            Cart
          </Typography>
          {cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <CartCard
                price={item?.price}
                gender={item?.gender || ""}
                quantity={item?.quantity}
                productTitle={item?.name}
                image={item?.image || "Loading"}
              />
              {!isMobile && <Divider />}
            </React.Fragment>
          ))}{" "}
        </Box>
      </>
    );
}
