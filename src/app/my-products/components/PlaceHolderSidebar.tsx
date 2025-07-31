import { ProfilePicture } from "@/components/ProfilePicture";
import { Box, Typography } from "@mui/material";

export default function PlaceHolderSidebar() {
  return (
    <Box
      width={280}
      sx={{
        display: { xs: "none", lg: "flex" },
        flexDirection: "column",
        gap: 2,
      }}
    >
      <ProfilePicture
        src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
        alt="User avatar"
        width={64}
      />
      <Typography variant="h6" fontWeight={500}>
        PLACEHOLDER
      </Typography>
      {Array.from({ length: 3 }).map((_, index) => (
        <Typography key={index} variant="body1" fontWeight={500}>
          placeholder list item
        </Typography>
      ))}
    </Box>
  );
}
