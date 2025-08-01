"use client";
import { Box, Typography } from "@mui/material";
import PromocodeAccordion from "./PromocodeAccordion";
// Update the import path if Button is located elsewhere, for example:
import Button from "@/components/Button";
import { useEffect, useState } from "react";

/**
 * A reusable summary component used in both the checkout and the cart pages.
 * Automatically recalculates the total when the subtotal, shipping, or tax values change.
 *
 * @component
 * @param {number} subtotal - Price of the items before tax and shipping
 * @param {number} shipping - Shipping cost
 * @param {number} tax - Tax amount
 * @param {string} buttonText - Label for the action button
 * @param {() => void} buttonAction - Function to run when the button is clicked
 *
 * @example
 * <CheckoutSummary
 *   subtotal={120}
 *   shipping={10}
 *   tax={25.2}
 *   buttonText="Place Order"
 *   buttonAction={() => console.log("Order placed")}
 * />
 */

type checkoutSummary = {
  subtotal: number;
  shipping: number;
  tax: number;
  buttonText: string;
  buttonAction(): void;
};

const CheckoutSummary = ({
  subtotal,
  shipping,
  tax,
  buttonText,
  buttonAction,
}: checkoutSummary) => {
  const [total, setTotal] = useState(subtotal);

  const infoStyles = {
    fontWeight: "400",
    fontSize: { xs: "20px", sm: "30px" },
  };

  /* Calculate total price */
  useEffect(() => {
    setTotal(subtotal + tax + shipping);
  }, [subtotal, tax, shipping]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", lg: "400px" },
        paddingBottom: "4rem",
      }}
    >
      <Typography
        variant="h2"
        sx={{ marginBottom: "69px", fontSize: { xs: "30px", sm: "45px" } }}
      >
        Summary
      </Typography>
      {/* Promocode dropdown */}
      <Box sx={{ marginBottom: "38px", width: { xs: "100%" } }}>
        <PromocodeAccordion />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={infoStyles}>
            Subtotal
          </Typography>
          <Typography variant="h3" sx={infoStyles}>
            ${subtotal}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={infoStyles}>
            Shipping
          </Typography>
          <Typography variant="h3" sx={infoStyles}>
            ${shipping}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={infoStyles}>
            Tax
          </Typography>
          <Typography variant="h3" sx={infoStyles}>
            ${tax}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderBlock: "1px solid #EAECF0",
          paddingTop: "19px",
          paddingBottom: "22px",
          marginTop: "56px",
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: "600", fontSize: { xs: "20px", sm: "30px" } }}
        >
          Total
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontWeight: "600", fontSize: { xs: "20px", sm: "30px" } }}
        >
          ${total}
        </Typography>
      </Box>

      <Button onClick={buttonAction} variant="contained" size="medium">
        {buttonText}
      </Button>
    </Box>
  );
};

export default CheckoutSummary;
