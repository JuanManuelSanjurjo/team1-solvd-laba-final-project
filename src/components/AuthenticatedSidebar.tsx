"use client";
import { JSX } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import {
  FavoriteBorder,
  ShoppingCart,
  History,
  Settings,
  Logout,
} from "@mui/icons-material";

const AuthenticatedSidebar = (): JSX.Element => {
  const drawerWidth = 240;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          padding: 2,
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Avatar src="/user-avatar.jpg" />
          <Typography variant="subtitle1">Jane Meldrum</Typography>
        </Box>

        <List>
          <ListItem disablePadding>
            <ListItemIcon>
              <ShoppingCart />
            </ListItemIcon>
            <ListItemText primary="My products" />
          </ListItem>

          <ListItem disablePadding>
            <ListItemIcon>
              <History />
            </ListItemIcon>
            <ListItemText primary="Order history" />
          </ListItem>

          <ListItem disablePadding>
            <ListItemIcon>
              <FavoriteBorder />
            </ListItemIcon>
            <ListItemText primary="My Wishlist" />
          </ListItem>

          <ListItem disablePadding>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>

          <ListItem disablePadding>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default AuthenticatedSidebar;
