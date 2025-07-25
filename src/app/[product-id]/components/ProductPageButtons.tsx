import { Box, Button } from "@mui/material";

export default function ProductPageButtons() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "26px",
        marginTop: 4,
        "& button": {
          width: "100%",
          fontWeight: 500,
          height: "60px",
        },
      }}
    >
      <Button variant="outlined">Add to wishlist</Button>
      <Button variant="contained">Add to cart</Button>
    </Box>
  );
}
