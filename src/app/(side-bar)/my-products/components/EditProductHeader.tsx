import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
/**
 * Props for the EditProductHeader component.
 *
 * @interface EditProductHeaderProps
 * @property {() => void} onClose - Callback fired when the close icon is clicked (used in mobile view).
 * @property {string} title - The header title text to display.
 */
interface EditProductHeaderProps {
  onClose: () => void;
  title: string;
}

/**
 * A header component for the Edit Product page.
 *
 * Displays the product title and a close button (visible only on mobile).
 *
 * @component
 * @param {EditProductHeaderProps} props - The props for the component.
 * @returns {JSX.Element} A styled header section with title and description.
 */

export function EditProductHeader({ onClose, title }: EditProductHeaderProps) {
  return (
    <Box sx={{ width: { sm: "100%", md: "60%" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h2" sx={{ marginBottom: "36px" }}>
          {title}
        </Typography>
        <Box sx={{ display: { xs: "block", sm: "none" } }} onClick={onClose}>
          <CloseIcon
            sx={{
              width: "30px",
              height: "30px",
              color: "rgba(73, 73, 73, 1)",
              marginRight: "14px",
              marginTop: "14px",
            }}
          />
        </Box>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ marginBottom: "40px" }}
      >
        Easily add new footwear products to your store. Provide all the key
        details—name, size, price, and images—to keep your catalog fresh and
        attractive. The more complete your product info, the easier it is for
        customers to find what they love.
      </Typography>
    </Box>
  );
}
