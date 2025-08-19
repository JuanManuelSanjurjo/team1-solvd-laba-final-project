import { Box } from "@mui/material";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      width={"100%"}
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBlock: 4,
          marginInline: "40px",
          gap: "24px",
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
