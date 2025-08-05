import { Typography, Box } from "@mui/material";
import PaymentInfo from "./components/PaymentInfo";
export default function Checkout() {

  return (
    <Box>
      <Typography variant="h2">Checkout</Typography>

      <Box component="section">
        <Typography variant="subtitle1">Personal info</Typography>
      </Box>

      <Box component="section">
        <Typography variant="subtitle1">Shipping info</Typography>
      </Box>

      <Box component="section">
        <Typography variant="subtitle1">Payment info</Typography>
        <PaymentInfo />
      </Box>
    </Box>
  );
}
