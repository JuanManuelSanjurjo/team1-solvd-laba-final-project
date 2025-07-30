"use client";
import ProductQuantityButton from "@/components/Buttons/ProductQuantityButton";
import { Typography, Box, Grid } from "@mui/material";
import { JSX } from "react";
import Button from "@/components/Button";
import { Trash } from "iconsax-react";
import Image from "next/image";

type CartCardProps = {
  quantity: number;
  handleAdd(): void;
  handleRest(): void;
  productTitle: string;
  gender: string;
  stock: boolean;
  price: number;
};

const CartCard = ({
  quantity,
  //   handleAdd,
  //   handleRest,
  productTitle,
  gender,
  stock,
  price,
}: CartCardProps): JSX.Element => {
  return (
    <Box sx={{ display: "flex", gap: "46px", paddingBlock: "60px" }}>
      <Image width={223} height={214} alt={productTitle} src="/" />
      <Grid container spacing={2} sx={{ width: "694px" }}>
        <Grid size={10}>
          <Typography variant="h3">{productTitle}</Typography>
          <Typography
            variant="subtitle1"
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              marginTop: "4px",
            })}
          >
            {gender} &rsquo Shoes
          </Typography>
          <Typography
            sx={(theme) => ({
              fontSize: 25,
              fontWeight: 600,
              color: theme.palette.primary.main,
              marginTop: "12px",
            })}
          >
            {stock ? "In Stock" : "No Stock"}
          </Typography>
        </Grid>

        <Grid size={2}>
          <Typography variant="h3">${price}</Typography>
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              paddingRight: "17px",
              borderRight: "1px solid #8B8E93",
            }}
          >
            <ProductQuantityButton /* onClick={handleAdd} */ type="Minus" />
            <Typography variant="h4" color="#494949">
              {quantity}
            </Typography>
            <ProductQuantityButton /* onClick={handleRest} */ type="Add" />
            <Typography variant="h4" color="#494949">
              Quantity
            </Typography>
          </Box>

          <Button
            sx={{
              color: "#8B8E93",
              fontSize: "24px",
              paddingLeft: "17px",
              borderRadius: 0,
            }}
            startIcon={<Trash size={24} color="#8B8E93" />}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartCard;
