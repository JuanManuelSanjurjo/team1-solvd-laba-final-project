import { Box } from "@mui/material";
import BannerProfileCard from "./BannerProfileCard";

/**
 * Banner
 *
 * This component renders a banner with a profile picture and a name.
 * It uses the BannerProfileCard component to display the user's avatar.
 *
 * @component
 *
 * @returns {JSX.Element} A banner with a profile picture and name.
 */
export default function MyProductsBanner() {
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
