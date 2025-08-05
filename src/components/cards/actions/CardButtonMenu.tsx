"use client";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { useState, JSX, MouseEvent } from "react";
import { Box } from "@mui/material";

/**
 * CardButtonMenu
 *
 * This component is a menu button that displays a dropdown menu when clicked.
 * Is passed to the Card component to be rendered on top of the image.
 * @returns {JSX.Element} with the card menu component.
 */

export default function CardButtonMenu(): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open: boolean = Boolean(anchorEl);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
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
        <MenuItem onClick={handleClose}>View</MenuItem>
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>Duplicate</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}
