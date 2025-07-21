"use client";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { useState, JSX, MouseEvent } from "react";
import { Box } from "@mui/material";

/**
 * CardMenu
 *
 * This component is a menu button that displays a dropdown menu when clicked.
 *
 * @returns {JSX.Element} with the card menu component.
 */

export default function CardMenu(): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open: boolean = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <MoreHorizRoundedIcon
        id="basic-button"
        sx={{
          cursor: "pointer",
          color: "#292D32",
          transition: "0.1s",

          borderRadius: 2,
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.75)",
          },
        }}
        onClick={handleClick}
      />
      <Menu
        m={0}
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
      >
        <MenuItem onClick={handleClose}>View</MenuItem>
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>Duplicate</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}
