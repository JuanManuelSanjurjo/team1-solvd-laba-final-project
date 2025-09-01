"use client";

import React from "react";
import { Divider, Typography, Box } from "@mui/material";
import CartCard from "./CartCard";
import { useCartStore } from "@/store/cart-store";
import { CartItem } from "../types";
import ProductsEmptyState from "@/components/ProductsEmptyState";
import { useRouter } from "next/navigation";
import CheckoutSummary from "../../components/CheckoutSummary";
import { Link } from "@mui/material";
import { useCallback } from "react";

/**
 * Cart page component that displays a list of products in the user's shopping cart.
 * Shows cart items with quantity controls and checkout summary, or an empty state if no items.
 * Provides navigation back to products and checkout functionality.
 *
 * @component
 * @param {CartProps} props - The component props
 * @param {string} props.userId - The unique identifier for the user whose cart is being displayed
 * @returns {JSX.Element} The rendered cart page with cart items and checkout summary, or an empty state
 */
type CartProps = {
  userId: string;
};

export default function Cart({ userId }: CartProps) {
  const byUser = useCartStore((state) => state.byUser);
  const cartItems: CartItem[] = userId ? byUser[userId] ?? [] : [];
  const router = useRouter();

  const cartIsEmpty = cartItems.length === 0;

  const visitProducts = useCallback(() => {
    router.push("/products");
  }, [router]);

  if (cartIsEmpty) {
    return (
      <Box
        sx={{
          width: "90%",
          height: "100%",
          margin: "auto",
          marginTop: "160px",
        }}
      >
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
            subtitle="Browse our products and find your perfect pair!"
            buttonText="Add Product"
            onClick={visitProducts}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          lg: "row",
        },
        paddingInline: "20px",
        marginTop: { xs: "25px", md: "80px" },
        justifyContent: "space-around",
      }}
    >
      <Box sx={{ marginTop: "80px" }}>
        <Link href="/products" sx={{ color: "#494949" }}>
          Back to products
        </Link>
        <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 45 } }}>
          Cart
        </Typography>
        {cartItems.map((item) => (
          <Box
            sx={{ marginY: { xs: "30px", md: "60px" } }}
            key={item.id + item.size}
          >
            <CartCard
              id={item?.id}
              gender={item?.gender || ""}
              quantity={item?.quantity}
              productTitle={item?.name}
              image={item?.image}
              size={item.size || 0}
              userId={userId}
            />
            <Divider
              sx={{
                display: { xs: "none", lg: "block" },
                marginTop: { xs: "30px", md: "60px" },
              }}
            />
          </Box>
        ))}{" "}
      </Box>

      <Box sx={{ marginTop: "80px" }}>
        <CheckoutSummary
          buttonText="Checkout"
          buttonAction={() => router.push("/checkout")}
          userId={userId}
          disabled={cartIsEmpty}
        />
      </Box>
    </Box>
  );
}
