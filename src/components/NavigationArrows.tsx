"use client";

import { Box, styled } from "@mui/material";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { JSX } from "react";

export type NavigationArrowsProps = {
  variant?: "product_card" | "testimonials";
  handleNext?: () => void;
  handlePrev?: () => void;
};

/**
 * StyledBox is a circular container for each arrow icon.
 *
 * The styling changes based on the `variant` provided.
 */
const StyledBox = styled(Box)(
  ({ variant = "product_card" }: Pick<NavigationArrowsProps, "variant">) => ({
    width: variant === "product_card" ? "24px" : "38px",
    height: variant === "product_card" ? "24px" : "38px",
    border:
      variant === "product_card"
        ? "unset"
        : "2px solid rgba(255, 255, 255, 0.4)",
    backgroundColor: variant === "product_card" ? "#fff" : "unset",
    borderRadius: "100%",
    cursor: "pointer",
  }),
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
 * @param {Function} props.handleNext - A function to handle the next button click.
 * @param {Function} props.handlePrev - A function to handle the previous button click.
 * @returns {JSX.Element}
 *
 * @example
 * <NavigationArrows variant="testimonials" />
 */
export default function NavigationArrows({
  variant = "product_card",
  handleNext,
  handlePrev,
}: NavigationArrowsProps): JSX.Element {
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      p={1}
      gap={2}
      position={variant === "product_card" ? "absolute" : "static"}
      bottom={variant === "product_card" ? 24 : "66%"} // for testimonials check when used
      right={variant === "product_card" ? 32 : 45}
    >
      <Box
        sx={{
          display: "flex",
          gap: variant === "product_card" ? "16px" : "32px",
        }}
      >
        <StyledBox variant={variant} onClick={handlePrev}>
          <ArrowLeft2 style={{ padding: "5px" }} color="#0d0d0d" />
        </StyledBox>
        <StyledBox variant={variant} onClick={handleNext}>
          <ArrowRight2 style={{ padding: "5px" }} color="#0d0d0d" />
        </StyledBox>
      </Box>
    </Box>
  );
}
