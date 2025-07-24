import { Card, CardContent, CardMedia, Typography } from "@mui/material";

type ProductCardProps = {
  imageUrl: string;
  name: string;
  description: string;
  size: string;
  backgroundColor?: string;
};
/**
 * Renders a product card displaying an image, name, description, and size.
 * Optionally allows setting a custom background color.
 * @component
 *
 * @param imageUrl - The URL of the product image
 * @param name - The name of the product
 * @param description - A short description of the product
 * @param size -  The size label to be displayed (e.g., "8 UK").
 * @param backgroundColor -(Optional) Custom background color for the card
 * @returns {JSX.Element}
 * @example
 *  <ProductCard imageUrl="/assets/product-img.png" name="Nike Air Max 270"
        description="Women's Shoes" size="8 UK" backgroundColor='white'
    />
 */

function ProductCard({
  imageUrl,
  name,
  description,
  size,
  backgroundColor,
}: ProductCardProps) {
  return (
    <Card
      sx={{
        display: "flex",
        width: "100%",
        maxWidth: { xs: "100%", sm: "550px" },
        height: "104px",
        p: 1,
        bgcolor: backgroundColor,
        boxShadow: "none",
        alignItems: "center",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: "104px",
          height: "104px",
          objectFit: "cover",
          borderRadius: 1,
          flexShrink: 0,
        }}
        image={imageUrl}
        alt={name}
      />
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 0,
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            lineHeight: "24px",
            fontSize: { xs: "16px", sm: "24px", md: "24px" },
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            lineHeight: "24px",
            fontSize: { xs: "14px", sm: "16px", md: "16px" },
          }}
        >
          {description}
        </Typography>
        <Typography
          variant="cartText"
          sx={{
            fontWeight: 700,
            lineHeight: "20px",
            fontSize: { xs: "12px", sm: "14px", md: "14px" },
          }}
        >
          <strong>Size: {size}</strong>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
