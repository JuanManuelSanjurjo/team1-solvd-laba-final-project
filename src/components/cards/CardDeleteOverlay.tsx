"use client";
import { Box } from "@mui/material";
import { Trash } from "iconsax-react";
import { useState, JSX } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";

/**
 * CardDeleteOverlay
 *
 * This component is an overlay that, when clicked,
 * opens a confirmation modal with a message asking the user to confirm deleting the item.
 *
 * @returns {JSX.Element} with the card delete overlay component.
 */

export default function CardDeleteOverlay(): JSX.Element {
  const [showModal, setShowModal] = useState(false);

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
      {" "}
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
          onClick={() => setShowModal(true)}
        />
      </Box>
      <ConfirmationModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        title="Are you sure to delete selected item?"
        text="Lorem ipsum dolor sit amet consectetur. Sed imperdiet tempor facilisi massa aliquet sit habitant. Lorem ipsum dolor sit amet consectetur."
        primaryBtn="Delete"
        secondaryBtn="Cancel"
      />
    </Box>
  );
}
