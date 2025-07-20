import { Box, Paper, Rating, Typography } from "@mui/material";
import NavigationArrows, {
  ArrowsVariantType,
} from "@/components/NavigationArrows";

export default function Testimonials({
  variant,
}: {
  variant?: ArrowsVariantType;
}) {
  const quote = `"Lorem Ipsum is a really great company because the team is
  passionate about the projects they produce, the people they work
  with, the quality of the work they do."`;

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "75%",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          border: "2px solid rgba(228, 228, 228, 0.78)",
          padding: "3em",
          background: `radial-gradient(
            64.9% 185.04% at 19.81% 27.89%,
            rgba(255, 255, 255, 0.42) 0%,
            rgba(255, 255, 255, 0.06) 100%
          )`,
          backdropFilter: "blur(24px)",
          borderRadius: "32px",
          color: "#0D0D0D",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ fontSize: "25px" }}>{quote}</Typography>
          <NavigationArrows variant={variant} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            margin: "16px 0 0 0",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "600",
              display: "inline",
              marginRight: "10px",
            }}
          >
            John Stone
          </Typography>
          <Rating name="read-only" size="small" value={4} readOnly />
        </Box>
        <Typography sx={{ display: "block", color: "#797979" }}>
          Ukraine, Chernivtsi
        </Typography>
      </Paper>
    </Box>
  );
}
