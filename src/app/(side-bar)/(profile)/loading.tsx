import Loading from "@/app/loading";
import { Box } from "@mui/material";

export default function ProfileLoading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "70vh",
      }}
    >
      <Loading
        sx={{ flex: 1, overflow: "auto", height: "100vh", width: "unset" }}
      />
    </Box>
  );
}
