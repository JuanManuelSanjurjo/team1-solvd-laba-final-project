import { Box } from "@mui/material";
import MyProductsBanner from "./components/MyProductsBanner";
import MyProductsMainContent from "./components/MyProductsMainContent";
import AuthenticatedSidebar from "@/components/AuthenticatedSidebar";

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
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "none",
            md: "block",
          },
          marginTop: {
            xs: "60px",
            sm: "90px",
            md: "120px",
          },
        }}
      >
        <AuthenticatedSidebar />
      </Box>

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
