import { Box, Skeleton } from "@mui/material";

export default function SkeletonGallery() {
  return (
    <Box width="100%">
      <Box
        display="flex"
        maxWidth={{ xs: "100%", md: 680 }}
        maxHeight={630}
        sx={{
          aspectRatio: "1/0.9",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 1,
        }}
      >
        {/* Thumbnail stack */}
        <Box
          display="flex"
          flexDirection={{ xs: "row", md: "column" }}
          gap={1}
          justifyContent="start"
          alignItems="center"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              animation="wave"
              variant="rectangular"
              width={60}
              height={60}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>

        {/* Main image */}
        <Skeleton
          animation="wave"
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ flex: 1, borderRadius: 1 }}
        />
      </Box>
    </Box>
  );
}
