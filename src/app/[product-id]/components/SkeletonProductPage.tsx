import { Box, Container, Skeleton } from "@mui/material";

export default function ProductPageSkeleton() {
  return (
    <Box marginBlock="100px" paddingInline={{ xs: 4, xl: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: {
            xs: "60px",
            sm: "90px",
            md: "120px",
          },
        }}
      >
        <Container
          disableGutters
          sx={{
            maxWidth: { xs: "95%", md: 1300 },
            display: "flex",
            justifyContent: "center",
            alignItems: {
              xs: "center",
              md: "flex-start",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: "100px",
          }}
        >
          {/* Skeleton Gallery */}
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

          {/* Skeleton Product Details */}
          <Box
            maxWidth={"520px"}
            width="100%"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Title and Price */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: {
                    xs: "flex-start",
                    md: "flex-end",
                  },
                  flexDirection: { xs: "column", md: "row" },
                  gap: 1,
                }}
              >
                <Skeleton
                  width="70%"
                  height={40}
                  animation="wave"
                  variant="text"
                />
                <Skeleton
                  width={80}
                  height={40}
                  animation="wave"
                  variant="text"
                />
              </Box>
              <Skeleton
                width="40%"
                height={30}
                animation="wave"
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Size Label */}
            <Skeleton width="100px" height={30} animation="wave" />

            {/* Sizes Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, 82px)",
                justifyContent: "space-between",
                alignItems: "center",
                gap: {
                  xs: 1,
                  md: 3,
                },
              }}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton
                  key={i}
                  animation="wave"
                  width={82}
                  height={40}
                  variant="rectangular"
                  sx={{
                    borderRadius: 1,
                  }}
                />
              ))}
            </Box>

            {/* Action Buttons */}
            <Skeleton width="100%" height={50} animation="wave" />
            <Skeleton width="100%" height={50} animation="wave" />

            {/* Description */}
            <Skeleton
              width="100px"
              height={30}
              animation="wave"
              variant="text"
            />
            <Skeleton
              width="100%"
              height={80}
              animation="wave"
              variant="text"
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
