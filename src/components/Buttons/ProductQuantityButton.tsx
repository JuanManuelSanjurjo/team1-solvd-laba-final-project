"use client"

import { IconButton as MuiIconButton  } from "@mui/material";

import { JSX } from "react";

import { Add, Minus } from "iconsax-react";

type ProductQuantityButtonProps = {
  type: "Add" | "Minus";
} ;

const ProductQuantityButton = ({type, ...props}: ProductQuantityButtonProps): JSX.Element => {

  const Icon = type === "Add" ? Add : Minus;

  return (
    <MuiIconButton 
    sx={(theme) => ({width: 32, height: 32,backgroundColor: type === "Add" ? theme.palette.primary.light : "#E8E8E8", })} 
    {...props}
    >
      <Icon 
      color={type === "Add" ? "#FE645E" : "#CECECE"}
      size={12}
        />
    </MuiIconButton>
  );
}

export default ProductQuantityButton
