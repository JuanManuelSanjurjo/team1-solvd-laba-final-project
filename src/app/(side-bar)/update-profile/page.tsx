import { Box, Button, Typography } from "@mui/material";
import UpdateProfileForm from "./components/UpdateProfileForm";
import { ProfilePicture } from "@/components/ProfilePicture";

export default function UpdateProfile() {
  return (
    <Box
      width={"100%"}
      sx={{
        display: "flex",
        justifyContent: { xs: "center", md: "flex-start" },
      }}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBlock: 4,
          marginInline: " 40px",
          gap: "24px",
        }}
        width={{ xs: 320, md: 436 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: 30,
              md: 40,
            },
          }}
        >
          My Profile
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: {
              xs: "28px",
              md: "76px",
            },
          }}
        >
          <ProfilePicture
            src="www.coolavatarbystrapi.com/images/upload/1.jpg"
            alt="User avatar"
            width={{ xs: 100, md: 150 }}
          ></ProfilePicture>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "24px",
            }}
          >
            <Button variant="outlined">Change photo</Button>
            <Button variant="contained">Delete</Button>
          </Box>
        </Box>
        <Typography variant="body2" paddingBlock="26px">
          Welcome back! Please enter your details to log into your account.
        </Typography>
        <UpdateProfileForm />
      </Box>
    </Box>
  );
}
