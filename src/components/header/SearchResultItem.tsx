import { Box, Typography } from "@mui/material";
import Link from "next/link";

/**
 * SearchResultItem
 *
 * This component displays a search result item with a product image, name, and price.
 * It includes a link to the product page and a function to set the search state.
 *
 * @param {Object} props - The props for the component.
 * @param {Object} props.product - The product object to display.
 * @param {Function} props.setIsSearching - A function to set the search state.
 *
 * @returns {JSX.Element} The search result item component.
 */

type SearchResultItemProps = {
  product: {
    id: number;
    name: string;
    gender?: string;
    price: number;
    image: string;
  };
  setIsSearching: (value: boolean) => void;
};
export default function SearchResultItem({
  product,
  setIsSearching,
}: SearchResultItemProps) {
  return (
    <Box
      component={Link}
      href={`/products/${product.id}`}
      onClick={() => setIsSearching(false)}
      sx={(theme) => ({
        display: "grid",
        alignItems: "center",
        color: theme.palette.text.secondary,
        gridTemplateColumns: {
          xs: "50px 1fr",
          md: "100px 3fr 2fr",
        },
        gap: {
          xs: 1,
          md: 4,
        },
        padding: 1,
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        },
      })}
    >
      <Box
        component="img"
        src={product?.image || "/assets/images/placeholders/70x70.svg"}
        alt={product?.name}
        width={{ xs: 40, md: 70 }}
        height={{ xs: 40, md: 70 }}
      />
      <Typography
        variant="subtitle1"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {product?.name}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          display: { xs: "none", md: "flex" },
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        $ {product?.price}
      </Typography>
    </Box>
  );
}
