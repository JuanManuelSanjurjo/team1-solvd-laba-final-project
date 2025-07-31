import { Box, Typography } from "@mui/material";
import { ProfilePicture } from "@/components/ProfilePicture";

type WelcomeComponentProps = {
  src: string;
  name: string;
};

/**
 * WelcomeComponent
 *
 * Renders a small welcome section with a user profile picture and greeting text.
 * Typically used in sidebars or headers to personalize the interface for the user.
 *
 * @component
 *
 * @param {Object} props - Component props.
 * @param {string} props.src - The URL of the user's profile picture.
 * @param {string} props.name - The name of the user to display in the greeting.
 *
 * @returns {JSX.Element} A greeting box with profile picture and user's name.
 *
 * @example
 * <WelcomeComponent
 *   src="https://example.com/avatar.jpg"
 *   name="John Doe"
 * />
 */

const WelcomeComponent = ({ src, name }: WelcomeComponentProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={2}
      mb={2}
      sx={{
        mt: { xs: 3, md: 4.7 },
        mb: 4,
        ml: { xs: 2, md: 5 },
      }}
    >
      <ProfilePicture src={src} alt="User avatar" width={64}></ProfilePicture>
      <Box display="flex" flexDirection="column">
        <Typography
          variant="body1"
          fontWeight={500}
          color="#98A2B3"
          sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
        >
          Welcome
        </Typography>
        <Typography
          variant="body1"
          fontWeight={500}
          sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
        >
          {name}
        </Typography>
      </Box>
    </Box>
  );
};
export default WelcomeComponent;
