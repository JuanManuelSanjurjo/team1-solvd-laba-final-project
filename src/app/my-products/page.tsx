import { Box } from "@mui/material";
import MyProductsBanner from "./components/MyProductsBanner";
import MyProductsMainContent from "./components/MyProductsMainContent";
import PlaceHolderSidebar from "./components/PlaceHolderSidebar";

export default function MyProducts() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        marginBlock: { xs: 10, md: 20 },
        marginInline: { lg: "40px" },
      }}
    >
      {/* ********** PLACEHOLDER FOR SIDEBAR ********** */}
      <PlaceHolderSidebar />
      {/* ********** END OF PLACEHOLDER FOR SIDEBAR ********** */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
        width={"100%"}
      >
        <MyProductsBanner />
        <MyProductsMainContent />
      </Box>
    </Box>
  );
}
