import { Bag } from "iconsax-react";
import { Box, Typography, Button } from "@mui/material";

export default function MyProductsEmptyState() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        height: "100%",
      }}
    >
      <Bag size={20} color="#292d32" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={500}
          sx={{ fontSize: { xs: 16, md: 20 } }}
        >
          You don{"'"}t have any products yet
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 15 } }}>
          Post can contain video, images and text.
        </Typography>
      </Box>
      <Button variant="contained">Add Product</Button>
    </Box>
  );
}
