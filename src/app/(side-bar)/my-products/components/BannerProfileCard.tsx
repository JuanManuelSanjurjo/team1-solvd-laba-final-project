import { Box, Typography } from "@mui/material";
import { ProfilePicture } from "@/components/ProfilePicture";
import { auth } from "@/auth";

/**
 * BannerProfileCard
 *
 * This component renders a banner with a profile picture and a name.
 * It uses the ProfilePicture component to display the user's avatar.
 *
 * @component
 *
 * @returns {JSX.Element} A banner with a profile picture and name.
 */

export default async function BannerProfileCard() {
  const session = await auth();

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
        src={session?.user.avatar?.url || ""}
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
          {session?.user?.username}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 15 } }}>
          1235 bonus points
        </Typography>
      </Box>
    </Box>
  );
}
