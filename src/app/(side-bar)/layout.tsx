import { Box } from "@mui/material";
import AuthenticatedSidebar from "@/components/AuthenticatedSidebar";
import { auth } from "@/auth";

/**
 * Layout
 *
 * This component renders the layout for the group of pages with the logged-in user sidebar.
 *
 * @returns {JSX.Element} The main content of the page.
 */

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        marginBlock: { xs: 8, md: 18 },
        marginInline: { lg: "0 40px" },
      }}
    >
      <Box
        sx={{
          display: {
            xs: "none",
            md: "block",
            lg: "block",
          },
        }}
      >
        <AuthenticatedSidebar session={session} />
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
