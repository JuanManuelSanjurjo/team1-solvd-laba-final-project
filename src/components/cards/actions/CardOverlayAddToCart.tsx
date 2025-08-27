"use client";
import { Box, Typography, Stack } from "@mui/material";
import { BagTick } from "iconsax-react";
import { Session } from "next-auth";
import { useState } from "react";
import SizeSelectorModal from "@/app/(purchase)/components/SizeSelectorModal";
import Select from "@/components/form-elements/Select";
import { useCartStore } from "@/store/cart-store";
import CardProduct from "./types";
import { useToastStore } from "@/store/toastStore";
/**
 * CardOverlayAddToCart
 *
 * This component is a button that, when clicked,
 * Is passed to the Card component to be rendered on top of the image.
 * Opens a confirmation modal with a message asking the user to confirm adding the item to the cart.
 *
 */

type CardOverlayAddToCardProps = {
  product: CardProduct;
  session: Session | null;
};

export default function CardOverlayAddToCart({
  product,
  session,
}: CardOverlayAddToCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const userId = session?.user.id;

  const addItem = useCartStore((state) => state.addItem);

  function handleClose(event: React.SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();

    setShowModal(false);
  }

  function handleConfirmAdd(e: React.MouseEvent) {
    e?.stopPropagation();
    e?.preventDefault();

    if (!userId) {
      return;
    }

    if (!selectedSize) {
      useToastStore.getState().show({
        severity: "error",
        message: "Please select a size before adding to cart",
      });
      return;
    }

    addItem(userId, {
      id: product.id,
      image: product.image,
      name: product.name,
      price: product.price,
      quantity: 1,
      gender: product.gender,
      size: selectedSize,
    });

    setShowModal(false);
  }

  return (
    <>
      {" "}
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
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          <BagTick size="20" color="#494949" />
          <Typography variant="caption" sx={{ fontSize: 8 }}>
            Add to cart
          </Typography>
        </Stack>
      </Box>
      <SizeSelectorModal
        showModal={showModal}
        onClose={handleClose}
        title="Select a size"
        text=""
        primaryBtn="Add"
        secondaryBtn="Cancel"
        onPrimary={handleConfirmAdd}
      >
        <Select
          name="size"
          label="Size"
          placeholder="Choose your size"
          required
          options={
            product.sizes?.map((n) => ({
              label: n.toString(),
              value: n,
            })) || []
          }
          value={selectedSize ?? ""}
          onChange={(e) => setSelectedSize(Number(e.target.value))}
        />
      </SizeSelectorModal>
    </>
  );
}
