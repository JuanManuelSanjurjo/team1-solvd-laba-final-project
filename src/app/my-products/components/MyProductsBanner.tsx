import { Box } from "@mui/material";
import BannerProfileCard from "./BannerProfileCard";

export default function Banner() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="img"
        src="/assets/images/profile-banner.png"
        height={{ xs: 135, md: 262 }}
        sx={{
          objectFit: "cover",
        }}
      />
      <Box
        height={84}
        sx={{
          position: "relative",
        }}
      >
        <BannerProfileCard />
      </Box>
    </Box>
  );
}
