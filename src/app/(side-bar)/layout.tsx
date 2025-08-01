import { Box } from "@mui/material";
import AuthenticatedSidebar from "@/components/AuthenticatedSidebar";

/**
 * Layout
 *
 * This component renders the layout for the group of pages with the logged-in user sidebar.
 *
 * @returns {JSX.Element} The main content of the page.
 */

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        marginBlock: { xs: 10, md: 18 },
        marginInline: { lg: "40px" },
      }}
    >
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "none",
            md: "block",
          },
          marginTop: {
            xs: "60px",
            sm: "90px",
            md: "120px",
          },
        }}
      >
        <AuthenticatedSidebar />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
        width={"100%"}
      >
        {children}
      </Box>
    </Box>
  );
}
