import { Bag } from "iconsax-react";
import { Box, Typography, Button } from "@mui/material";

type MyProductsEmptyStateProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  onClick: () => void;
};

/**
 * MyProductsEmptyState
 *
 * This component renders an empty state for the My Products page.
 * It displays a bag icon, a message, and a button to add a product.
 *
 * @property {string} title - The title of the empty state.
 * @property {string} subtitle - The subtitle of the empty state.
 * @property {string} buttonText - The text of the button.
 * @property {function} onClick - The function to be called when the button is clicked.
 *
 * @returns {JSX.Element} An empty state for the My Products page.
 */
export default function MyProductsEmptyState({
  title,
  subtitle,
  buttonText,
  onClick,
}: MyProductsEmptyStateProps) {
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
          {title}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 15 } }}>
          {subtitle}
        </Typography>
      </Box>
      <Button variant="contained" onClick={onClick}>
        {buttonText}
      </Button>
    </Box>
  );
}
