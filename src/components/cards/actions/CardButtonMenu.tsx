"use client";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { useState, JSX, MouseEvent } from "react";
import { Box } from "@mui/material";
import cardProduct from "./types/cardProduct";
import Link from "next/link";
import ConfirmationModal from "@/components/ConfirmationModal";

type CardButtonMenuProps = {
  product: cardProduct;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
};

/**
 * CardButtonMenu
 *
 * This component is a menu button that displays a dropdown menu when clicked.
 * Is passed to the Card component to be rendered on top of the image.
 * @param onDelte delete product callback.
 * @param product product object.
 * @param onEdit edit product callback.
 * @returns {JSX.Element} with the card menu component.
 */

export default function CardButtonMenu({
  product,
  onEdit,
  onDuplicate,
  onDelete,
}: CardButtonMenuProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open: boolean = Boolean(anchorEl);
  const [showModal, setShowModal] = useState(false);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  }
  function handleClose(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setAnchorEl(null);
  }
  function handleCloseModal(event: React.SyntheticEvent) {
    event.preventDefault();
    setShowModal(false);
  }

  function handleDeleteMenuClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setAnchorEl(null);
    setShowModal(true);
  }

  async function handleConfirmDelete(e: React.SyntheticEvent) {
    e.preventDefault();
    setShowModal(false);
    onDelete();
  }
  return (
    <Box>
      <IconButton
        id="basic-button"
        sx={{
          cursor: "pointer",
          color: "#292D32",
          transition: "0.1s",
          padding: 0.5,
          borderRadius: 2,
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.75)",
          },
        }}
        onClick={handleClick}
      >
        <MoreHorizRoundedIcon />
      </IconButton>

      <Menu
        id="popup-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        disableAutoFocusItem
        disableScrollLock
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "initial",
              backdropFilter: "initial",
            },
          },
        }}
      >
        <MenuItem component="button" onClick={handleClose}>
          <Link href={`/products/${product.id}`}>View</Link>
        </MenuItem>
        <MenuItem
          component="button"
          onClick={(e) => {
            e.preventDefault();
            onEdit();
            handleClose(e);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          component="button"
          onClick={(e) => {
            e.preventDefault();
            onDuplicate();
            handleClose(e);
          }}
        >
          Duplicate
        </MenuItem>
        <MenuItem component="button" onClick={handleDeleteMenuClick}>
          Delete
        </MenuItem>
      </Menu>
      <ConfirmationModal
        showModal={showModal}
        onClose={handleCloseModal}
        title="Are you sure to delete selected item?"
        text="Lorem ipsum dolor sit amet consectetur. Sed imperdiet tempor facilisi massa aliquet sit habitant. Lorem ipsum dolor sit amet consectetur."
        primaryBtn="Delete"
        secondaryBtn="Cancel"
        onPrimary={handleConfirmDelete}
      />
    </Box>
  );
}
