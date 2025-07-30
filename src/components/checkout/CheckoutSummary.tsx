import { Box, Typography } from "@mui/material";
import PromocodeAccordion from "./PromocodeAccordion";
import Button from "../Button";

type checkoutSummary = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  buttonText: string;
};

const CheckoutSummary = ({
  subtotal,
  shipping,
  tax,
  total,
  buttonText,
}: checkoutSummary) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "400px" }}>
      <Typography variant="h2" sx={{ marginBottom: "69px" }}>
        Summary
      </Typography>
      {/* Promocode dropdown */}
      <Box sx={{ marginBottom: "38px" }}>
        <PromocodeAccordion />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={{ fontWeight: "400" }}>
            Subtotal
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "400" }}>
            ${subtotal}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={{ fontWeight: "400" }}>
            Shipping
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "400" }}>
            ${shipping}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={{ fontWeight: "400" }}>
            Tax
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "400" }}>
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
        <Typography variant="h3" sx={{ fontWeight: "400" }}>
          Total
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: "400" }}>
          ${total}
        </Typography>
      </Box>

      <Button variant="contained" sx={{ height: "40px" }}>
        {buttonText}
      </Button>
    </Box>
  );
};

export default CheckoutSummary;
