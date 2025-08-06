import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * Layout wrapper for the Cart page.
 * Adds vertical spacing and a heading before rendering children content.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the cart layout.
 * @returns A styled layout with a "Cart" title and passed children.
 */

const CartLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ marginTop: "170px" }}>
      <Typography
        variant="h2"
        sx={{ fontSize: { xs: 30, md: 45 }, marginLeft: "10%" }}
      >
        Cart
      </Typography>
      {children}
    </Box>
  );
};

export default CartLayout;
