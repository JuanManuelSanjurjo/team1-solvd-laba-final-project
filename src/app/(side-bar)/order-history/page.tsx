import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import { Box, Typography } from "@mui/material";

export default function OrderHistory() {
  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography
          variant="h2"
          sx={{
            marginTop: "40px",
          }}
        >
          Order History
        </Typography>
      </Box>
      <MyProductsEmptyState
        title="You don't have any orders yet"
        subtitle="Start shooping checkout products available!"
        icon={LogoBlackSvg}
      ></MyProductsEmptyState>
    </Box>
  );
}
