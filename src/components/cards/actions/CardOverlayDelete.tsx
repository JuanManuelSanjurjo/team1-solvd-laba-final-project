"use client";
import { Box } from "@mui/material";
import { Trash } from "iconsax-react";
import { useState, JSX } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";

/**
 * CardOverlayDelete
 *
 * This component is an overlay that, when clicked,
 * Is passed to the Card component to be rendered on top of the image.
 * Opens a confirmation modal with a message asking the user to confirm deleting the item.
 * @param onDeletePreview delete callback.
 * @returns {JSX.Element} with the card delete overlay component.
 */

interface CardOverlayDeleteProps {
  onDeletePreview: () => void;
}

export default function CardOverlayDelete({
  onDeletePreview,
}: CardOverlayDeleteProps): JSX.Element {
  const [showModal, setShowModal] = useState(false);

  function handleClose(event: React.SyntheticEvent) {
    event.preventDefault();
    setShowModal(false);
  }

  return (
    <Box
      className="overlay"
      sx={{
        position: "absolute",
        inset: 0,
        opacity: 0,
        bgcolor: "rgba(0, 0, 0, 0.2)",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          cursor: "pointer",
          ".bg": {
            backgroundColor: "rgba(255,255,255,50%)",
            p: 3,
            borderRadius: 1000,
            boxSizing: "content-box",
          },
          "&:hover .bg": {
            backgroundColor: "rgba(255,255,255,75%)",
          },
        }}
      >
        <Trash
          size="20"
          color="#292D32"
          className="bg"
          onClick={(e) => {
            e.preventDefault();
            onDeletePreview();
          }}
        />
      </Box>
      <ConfirmationModal
        showModal={showModal}
        onClose={handleClose}
        title="Are you sure to delete selected item?"
        text="Please confirm this action before proceeding. Once deleted, this item will no longer be available."
        primaryBtn="Delete"
        secondaryBtn="Cancel"
        onPrimary={() => {
          console.log("Deleting");
        }}
      />
    </Box>
  );
}
