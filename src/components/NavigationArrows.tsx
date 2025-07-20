"use client";

import { Box, styled } from "@mui/material";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { JSX } from "react";

export type ArrowsVariantType = "product_card" | "testimonials";

/**
 * StyledBox is a circular container for each arrow icon.
 *
 * The styling changes based on the `variant` provided.
 */
const StyledBox = styled(Box)(
  ({ variant = "product_card" }: { variant?: ArrowsVariantType }) => ({
    width: "38px",
    height: "38px",
    border:
      variant === "product_card"
        ? "unset"
        : "2px solid rgba(228, 228, 228, 0.78)",
    backgroundColor: variant === "product_card" ? "#fff" : "unset",
    borderRadius: "100%",
    cursor: "pointer",
  })
);

/**
 * NavigationArrows renders a pair of left/right navigation arrows.
 *
 * These arrows are used for components like carousels or sliders. The style can
 * be changed based on the `variant` prop to match different use cases.
 *
 * @component
 * @param {Object} props - Component props
 * @param {ArrowsVariantType} [props.variant] - Optional style variant (default is "product_card")
 * @returns {JSX.Element}
 *
 * @example
 * <NavigationArrows variant="testimonials" />
 */
export default function NavigationArrows({
  variant,
}: {
  variant?: ArrowsVariantType;
}): JSX.Element {
  return (
    <Box sx={{ display: "flex", gap: "32px" }}>
      <StyledBox variant={variant}>
        <ArrowLeft2 style={{ padding: "5px" }} color="#0d0d0d" />
      </StyledBox>
      <StyledBox variant={variant}>
        <ArrowRight2 style={{ padding: "5px" }} color="#0d0d0d" />
      </StyledBox>
    </Box>
  );
}
