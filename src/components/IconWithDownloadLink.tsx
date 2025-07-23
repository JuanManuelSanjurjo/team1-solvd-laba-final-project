import { Box, Link, Typography } from "@mui/material";
import { Document } from "iconsax-react";
import { useTheme } from "@mui/material/styles";

/**
 * Renders a document icon followed by a link to download a PDF invoice.
 * The link opens the file in a new tab and triggers a download.
 * @component
 *
 * @returns {JSX.Element}
 */

const IconWithDownloadLink = () => {
  const theme = useTheme();
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Document size="20" color="#CD3C37" variant="Bold" />
      <Link
        href="/files/manual.pdf"
        download
        underline="hover"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: "text.primary" }}
      >
        <Typography
          variant="cartText"
          sx={{
            color: theme.palette.cartTextColor.primary,
            fontSize: "12px",
            lineHeight: "16px",
          }}
        >
          PDF invoice download
        </Typography>
      </Link>
    </Box>
  );
};

export default IconWithDownloadLink;
