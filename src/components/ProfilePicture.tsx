"use client";

import React, { useState, MouseEvent } from "react";
import { Avatar, Menu, MenuItem, Box } from "@mui/material";
import { signOut } from "next-auth/react";

/**
 * ProfilePicture component renders a circular avatar using the given image source.
 *
 * It uses MUI's `Avatar` component and sets both the width and height to create a square image,
 * which MUI styles as a circle by default.
 *
 * @component
 * @example
 *
 * <ProfilePicture
 *   src="www.coolavatarbystrapi.com/images/upload/1.jpg"
 *   alt="User avatar"
 *   width={40}
 * />
 *
 *
 * @param {Object} props - Component props
 * @param {string} props.src - The URL of the image to display inside the avatar.
 * @param {string} [props.alt='Profile picture'] - Alternative text for the avatar image.
 * @param {number} props.width - The width and height (in pixels) of the avatar. The avatar is always square.
 *
 * @returns {JSX.Element} A circular avatar displaying the provided image.
 */

interface ProfilePictureProps {
  border?: boolean;
  src: string;
  alt?: string;
  width: number;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  border = false,
  src,
  alt = "Profile picture",
  width,
}: ProfilePictureProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
    handleClose();
  };

  return (
    <Box>
      <Avatar
        src={src}
        alt={alt}
        onClick={handleClick}
        sx={{
          width,
          height: width,
          cursor: "pointer",
          border: border ? "5px solid white" : "none",
        }}
      />
      <Menu
        id="profile-menu"
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
      >
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
    </Box>
  );
};
