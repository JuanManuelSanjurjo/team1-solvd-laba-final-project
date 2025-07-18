"use client";

import { Box, styled } from "@mui/material";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

export default function TestimonialNavigation() {
  const StyledBox = styled(Box)({
    width: "38px",
    height: "38px",
    border: "2px solid rgba(228, 228, 228, 0.78)",
    borderRadius: "100%",
    cursor: "pointer",
  });

  return (
    <Box sx={{ display: "flex", gap: "32px" }}>
      <StyledBox>
        <ArrowLeft2 style={{ padding: "5px" }} color="#0d0d0d" />
      </StyledBox>
      <StyledBox>
        <ArrowRight2 style={{ padding: "5px" }} color="#0d0d0d" />
      </StyledBox>
    </Box>
  );
}
