import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import { Box, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Order History | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
};

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
