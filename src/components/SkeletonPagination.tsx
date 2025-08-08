import { Skeleton, Box } from "@mui/material";
export default function SkeletonPagination() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "50px",
        marginBottom: "100px",
        gap: 1,
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          sx={{
            display: "flex",
            borderRadius: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px",
            marginBottom: "100px",
            height: { xs: 26, md: 32 },
            width: { xs: 26, md: 32 },
          }}
        />
      ))}
    </Box>
  );
}
