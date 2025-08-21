"use client";
import { Box, Typography } from "@mui/material";
import PromocodeAccordion from "./PromocodeAccordion";
// Update the import path if Button is located elsewhere, for example:
import Button from "@/components/Button";
import { useCartStore } from "@/store/cart-store";

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
 *   buttonText="Place Order"
 *   buttonAction={() => console.log("Order placed")}
 * />
 */

type checkoutSummary = {
  buttonText: string;
  buttonAction(): void;
};

const CheckoutSummary = ({ buttonText, buttonAction }: checkoutSummary) => {
  const subtotal = useCartStore((state) => state.subtotal());
  const total = useCartStore((state) => state.total());
  const taxes = useCartStore((state) => state.taxes());
  const shipping = useCartStore((state) => state.shipping());

  const infoStyles = {
    fontWeight: "400",
    fontSize: { xs: "20px", sm: "30px" },
  };

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
            ${subtotal || "..."}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={infoStyles}>
            Shipping
          </Typography>
          <Typography variant="h3" sx={infoStyles}>
            ${shipping || "..."}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={infoStyles}>
            Tax
          </Typography>
          <Typography variant="h3" sx={infoStyles}>
            ${taxes || "..."}
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
          ${total || "..."}
        </Typography>
      </Box>

      <Button onClick={buttonAction} variant="contained" size="medium">
        {buttonText}
      </Button>
    </Box>
  );
};

export default CheckoutSummary;
