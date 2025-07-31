import { Box, Typography, Button } from "@mui/material";
import { JSX } from "react";

export default function MyPorductsHeader({
  isEmpty,
}: {
  isEmpty: boolean;
}): JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="h2"
        fontWeight={500}
        sx={{
          fontSize: {
            xs: 30,
            md: 40,
          },
        }}
      >
        My Products
      </Typography>
      {!isEmpty && (
        <Button variant="contained" sx={{ height: "40px" }}>
          Add Product
        </Button>
      )}
    </Box>
  );
}
