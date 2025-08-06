"use client";

import { Box } from "@mui/material";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import { useRouter } from "next/navigation";

const EmptyCart = () => {
  const router = useRouter();

  const buttonAction = () => {
    router.push("/products");
    console.log("Action");
  };

  return (
    <Box sx={{ marginTop: "80px" }}>
      <MyProductsEmptyState
        title="You don't have any products yet"
        subtitle="Post can contain video, images and text."
        buttonText="Add Product"
        onClick={buttonAction}
      />
    </Box>
  );
};

export default EmptyCart;
