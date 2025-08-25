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
import { useCartStore } from "@/store/cart-store";
import ProductsEmptyState from "@/components/ProductsEmptyState";
import { useRouter } from "next/navigation";
import CheckoutSummary from "../components/CheckoutSummary";

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
          <ProductsEmptyState
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
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            lg: "row",
          },
          paddingInline: "20px",
          marginTop: "80px",
          justifyContent: "space-around",
        }}
      >
        <Box sx={{ marginTop: "80px" }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 45 } }}>
            Cart
          </Typography>
          {cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <CartCard
                id={item?.id}
                gender={item?.gender || ""}
                quantity={item?.quantity}
                productTitle={item?.name}
                image={item?.image || "Loading"}
              />
              {!isMobile && <Divider />}
            </React.Fragment>
          ))}{" "}
        </Box>

        <Box sx={{ marginTop: "80px" }}></Box>
        <CheckoutSummary
          buttonText="Checkout"
          buttonAction={() => router.push("/checkout")}
        />
      </Box>
    );
}
