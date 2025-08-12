import { Box, Typography } from "@mui/material";
import Link from "next/link";

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
    <Link
      href={`/products/${product.id}`}
      onClick={() => setIsSearching(false)}
    >
      <Box
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
    </Link>
  );
}
