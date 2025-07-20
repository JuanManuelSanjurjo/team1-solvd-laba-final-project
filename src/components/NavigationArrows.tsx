"use client";

import { Box, styled } from "@mui/material";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

export type ArrowsVariantType = "product_card" | "testimonials";

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

export default function NavigationArrows({
  variant,
}: {
  variant?: ArrowsVariantType;
}) {
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
