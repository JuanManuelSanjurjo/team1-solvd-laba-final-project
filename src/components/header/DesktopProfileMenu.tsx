"use client";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { ProfilePicture } from "@/components/ProfilePicture";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

/**
 * DesktopProfileMenu
 *
 * This component displays a profile menu for desktop devices.
 * It includes a profile picture, a menu with links to various pages, and a sign out button.
 *
 * @returns {JSX.Element} The profile menu component.
 */

export default function DesktopProfileMenu({
  session,
}: {
  session: Session | null;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
        <Link href="/my-products">
          <MenuItem onClick={handleClose}>My Products</MenuItem>
        </Link>
        <Link href="/order-history">
          <MenuItem onClick={handleClose}>Order History</MenuItem>
        </Link>
        <Link href="/my-wishlist">
          <MenuItem onClick={handleClose}>My Wishlist</MenuItem>
        </Link>
        <Link href="/recently-viewed">
          <MenuItem onClick={handleClose}>Recently Viewed</MenuItem>
        </Link>
        <Link href="/update-profile">
          <MenuItem onClick={handleClose}>Settings</MenuItem>
        </Link>
        <MenuItem onClick={() => signOut()}>Log out</MenuItem>
      </Menu>
    </>
  );
}
