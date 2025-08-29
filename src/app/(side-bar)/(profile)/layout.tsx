import { Box } from "@mui/material";

/**
 * Layout component that wraps the profile pages.
 * Includes a container with a flex layout for the profile content.
 *
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout
 * @returns {JSX.Element} The rendered layout component with the profile content
 */
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
