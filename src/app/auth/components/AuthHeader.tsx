import { Typography } from "@mui/material";

/**
 * AuthHeader component that displays the authentication header with a title and subtitle.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.title - The title to be displayed in the header
 * @param {string} props.subtitle - The subtitle to be displayed in the header
 * @returns {JSX.Element} The rendered authentication header component
 */
export default function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <>
      <Typography
        variant="h2"
        fontWeight={500}
        sx={{ fontWeight: 500, mb: "16px" }}
      >
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: "48px" }}>
        {subtitle}
      </Typography>
    </>
  );
}
