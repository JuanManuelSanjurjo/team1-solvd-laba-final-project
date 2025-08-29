import { IconButton as MuiIconButton } from "@mui/material";
import { IconButtonProps } from "@mui/material";

import { JSX } from "react";

import { Add, Minus } from "iconsax-react";

/**
 * Reusable button for adjusting product quantity.
 * Displays either an add or minus icon depending on the operation.
 *
 * @component
 * @param {ProductQuantityButtonProps} props - The component props
 * @param {"Add" | "Minus"} props.operation - Determines which icon and background color to use
 * @returns {JSX.Element} A styled icon button for quantity adjustment
 */

type ProductQuantityButtonProps = {
  operation: "Add" | "Minus";
} & IconButtonProps;

const ProductQuantityButton = ({
  operation,
  ...props
}: ProductQuantityButtonProps): JSX.Element => {
  const Icon = operation === "Add" ? Add : Minus;

  return (
    <MuiIconButton
      sx={(theme) => ({
        width: 32,
        height: 32,
        backgroundColor:
          operation === "Add" ? theme.palette.primary.light : "#E8E8E8",
      })}
      {...props}
    >
      <Icon color={operation === "Add" ? "#FE645E" : "#CECECE"} size={12} />
    </MuiIconButton>
  );
};

export default ProductQuantityButton;
