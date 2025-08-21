"use client";
import { Typography, Box, Grid } from "@mui/material";
import { JSX } from "react";
import Button from "@/components/Button";
import { Trash } from "iconsax-react";
// import Image from "next/image"; //Add later. There is an issue with the external url not being add into next.config.js
import QuantityHandler from "./QuantityHandler";
import CartCardImage from "./CartCardImage";
import { useCartStore } from "@/store/cart-store"; // ruta a tu store

type CartCardProps = {
  id: number;
  quantity: number;
  productTitle: string;
  gender: string;
  image: string;
};

/**
 * A card component used to display product details inside the shopping cart.
 * Shows product image, title, gender, price, quantity controls, and a delete button.
 *
 * @component
 * @param {number} quantity - Current quantity of the product.
 * @param {string} productTitle - Title or name of the product.
 * @param {string} gender - Gender category of the product (e.g., "Men", "Women").
 * @param {string} image - URL of the product image.
 *
 * @returns {JSX.Element} The rendered cart item card.
 */

const CartCard = ({
  id,
  quantity,
  productTitle,
  gender,
  image,
  ...moreProps
}: CartCardProps): JSX.Element => {
  const removeItem = useCartStore((state) => state.removeItem);
  const totalOfProduct = useCartStore((state) => state.totalOfProduct);

  return (
    <Box
      {...moreProps}
      sx={{
        display: "flex",
        paddingBlock: { xs: "15px", sm: "60px" },
        justifyContent: "space-around",
        maxWidth: "963px",
        width: { lg: "65vw", md: "100%" },
        paddingRight: "2rem",
        gap: "5%",
      }}
    >
      <CartCardImage image={image} />

      <Grid container spacing={2} sx={{ width: "694px" }}>
        <Grid size={10}>
          <Typography variant="h3" sx={{ fontSize: { xs: 12, sm: 30 } }}>
            {productTitle}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              marginTop: "4px",
            })}
          >
            {gender}&apos;s Shoes
          </Typography>

          <Typography
            sx={(theme) => ({
              display: { xs: "none", sm: "block" },
              fontSize: 25,
              fontWeight: 600,
              color: theme.palette.primary.main,
              marginTop: "12px",
            })}
          >
            In stock
          </Typography>
        </Grid>

        <Grid size={2}>
          <Typography variant="h3" sx={{ fontSize: { xs: 12, sm: 30 } }}>
            ${totalOfProduct(id)}
          </Typography>
        </Grid>

        {/*  Actions */}
        <Grid
          size={12}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "34px",
            justifyContent: "right",
          }}
        >
          <Grid sx={{ display: "flex" }}>
            <QuantityHandler quantity={quantity} id={id} />

            <Button
              onClick={() => removeItem(id)}
              sx={{
                color: "#8B8E93",
                fontSize: { xs: 12, sm: 24 },
                paddingLeft: "17px",
                borderRadius: 0,
              }}
              startIcon={<Trash size={24} color="#8B8E93" />}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartCard;
