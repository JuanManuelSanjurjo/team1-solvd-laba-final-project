import { Typography } from "@mui/material";

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
