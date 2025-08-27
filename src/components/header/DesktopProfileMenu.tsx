"use client";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { ProfilePicture } from "@/components/ProfilePicture";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useToastStore } from "@/store/toastStore";

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

  const { show } = useToastStore();

  const handleLogout = () => {
    show({
      severity: "success",
      message: "Logging out...",
    });
    signOut();
  };
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
        <MenuItem onClick={handleClose} component={Link} href="/order-history">
          Order History
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} href="/my-wishlist">
          My Wishlist
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={Link}
          href="/recently-viewed"
        >
          Recently Viewed
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} href="/update-profile">
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
    </>
  );
}
