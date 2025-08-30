"use client";
import { Box, Typography } from "@mui/material";
import PromocodeAccordion from "./PromocodeAccordion";
import Button from "@/components/Button";
import { useCartStore } from "@/store/cart-store";

type checkoutSummary = {
  buttonText: string;
  buttonAction(): void;
  userId: string;
  disabled: boolean;
};

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

const CheckoutSummary = ({
  buttonText,
  buttonAction,
  userId,
  disabled,
}: checkoutSummary) => {
  const subtotal = useCartStore((state) => state.subtotal(userId));
  const total = useCartStore((state) => state.total(userId));
  const taxes = useCartStore((state) => state.taxes(userId));
  const shipping = useCartStore((state) => state.shipping(userId));

  const infoStyles = {
    fontWeight: "400",
    fontSize: { xs: "20px", sm: "30px" },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", lg: "300px", xl: "400px" },
        paddingBottom: "4rem",
      }}
    >
      <Typography
        variant="h2"
        sx={{ marginBottom: "69px", fontSize: { xs: "30px", sm: "45px" } }}
      >
        Summary
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={infoStyles}>
            Subtotal
          </Typography>
          <Typography variant="h3" sx={infoStyles}>
            ${subtotal || "Error"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={infoStyles}>
            Shipping
          </Typography>
          <Typography variant="h3" sx={infoStyles}>
            ${shipping ?? "Error"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={infoStyles}>
            Tax
          </Typography>
          <Typography variant="h3" sx={infoStyles}>
            ${taxes || "Error"}
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

      <Button
        type="submit"
        onClick={buttonAction}
        variant="contained"
        size="medium"
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default CheckoutSummary;
