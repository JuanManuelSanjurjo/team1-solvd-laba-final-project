import { LogoBlackSvg } from "@/components/LogoBlackSvg";
import MyProductsEmptyState from "@/components/MyProductsEmptyState";
import { Box } from "@mui/material";
import { Metadata } from "next";
import ProfileHeaderTitle from "../components/ProfileHeaderTitle";

export const metadata: Metadata = {
  title: `Order History | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
};

export default function OrderHistory() {
  return (
    <>
      <ProfileHeaderTitle>Order History</ProfileHeaderTitle>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <MyProductsEmptyState
          title="You don't have any orders yet"
          subtitle="Start shooping checkout products available!"
          icon={LogoBlackSvg}
        />
      </Box>
    </>
  );
}
