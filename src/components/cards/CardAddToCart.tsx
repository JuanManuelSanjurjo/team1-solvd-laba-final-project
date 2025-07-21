"use client";
import { Box, Typography, Stack } from "@mui/material";
import { BagTick } from "iconsax-react";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useState, JSX } from "react";

/**
 * CardAddToCart
 *
 * This component is a button that, when clicked,
 * opens a confirmation modal with a message asking the user to confirm adding the item to the cart.
 *
 * @returns {JSX.Element} with the card add to cart component.
 */

export default function CardAddToCart(): JSX.Element {
  const [showModal, setShowModal] = useState(false);

  return (
    <Box
      sx={{
        color: "#292D32",
        cursor: "pointer",
        ".bg": {
          backgroundColor: "rgba(255,255,255,50%)",
          p: 2,
          borderRadius: 1000,
        },
        "&:hover .bg": {
          backgroundColor: "rgba(255,255,255,75%)",
        },
      }}
    >
      <Stack
        className="bg"
        sx={{
          alignItems: "center",
          justifyContent: "center",
          aspectRatio: "1/1",
        }}
        onClick={() => setShowModal(true)}
      >
        <BagTick size="20" color="#494949" />
        <Typography variant="caption" sx={{ fontSize: 8 }}>
          Add to cart
        </Typography>
      </Stack>
      <ConfirmationModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        title="Are you sure to add to cart?"
        text="Lorem ipsum dolor sit amet consectetur. Sed imperdiet tempor facilisi massa aliquet sit habitant. Lorem ipsum dolor sit amet consectetur."
        primaryBtn="Add"
        secondaryBtn="Cancel"
      />
    </Box>
  );
}
