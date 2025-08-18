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
        <MenuItem component={Link} href="/my-products" onClick={handleClose}>
          My Products
        </MenuItem>
        <MenuItem component={Link} href="/order-history" onClick={handleClose}>
          Order History
        </MenuItem>
        <MenuItem component={Link} href="/my-wishlist" onClick={handleClose}>
          My Wishlist
        </MenuItem>
        <MenuItem
          component={Link}
          href="/recently-viewed"
          onClick={handleClose}
        >
          Recently Viewed
        </MenuItem>
        <MenuItem component={Link} href="/update-profile" onClick={handleClose}>
          Settings
        </MenuItem>
        <MenuItem onClick={() => signOut()}>Log out</MenuItem>
      </Menu>
    </>
  );
}
