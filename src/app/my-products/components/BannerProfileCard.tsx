import { Box, Typography } from "@mui/material";
import { ProfilePicture } from "@/components/ProfilePicture";

export default function ProfileCard() {
  // To be replaced with the actual profile picture
  const profilePic =
    "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D";

  return (
    <Box
      sx={{
        position: "absolute",
        left: { xs: 20, lg: 58 },
        bottom: 0,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        gap: 3,
      }}
    >
      <ProfilePicture
        src={profilePic}
        alt="User avatar"
        width={112}
        border={true}
      />
      <Box pb={"15px"}>
        <Typography
          variant="subtitle1"
          fontWeight={500}
          sx={{ fontSize: { xs: 14, md: 20 } }}
        >
          John Doe
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 15 } }}>
          1235 bonus points
        </Typography>
      </Box>
    </Box>
  );
}
