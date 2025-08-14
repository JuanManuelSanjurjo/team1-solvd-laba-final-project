"use client";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { ProfilePicture } from "@/components/ProfilePicture";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

/**
 * DesktopProfileMenu
 *
 * This component displays a profile menu for desktop devices.
 * It includes a profile picture, a menu with links to various pages, and a sign out button.
 *
 * @returns {JSX.Element} The profile menu component.
 */

export default function DesktopProfileMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <ProfilePicture
        width={24}
        alt={session?.user?.username}
        src={session?.user.avatar?.url || ""}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
        sx={(theme) => ({
          "& .MuiMenuItem-root": {
            color: theme.palette.text.secondary,
          },
        })}
      >
        <MenuItem onClick={handleClose}>
          <Link href="/my-products">My Products</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="/order-history">Order History</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="/my-wishlist">My Wishlist</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="/recently-viewed">Recently Viewed</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="/update-profile">Settings</Link>
        </MenuItem>
        <MenuItem onClick={() => signOut()}>Log out</MenuItem>
      </Menu>
    </>
  );
}
