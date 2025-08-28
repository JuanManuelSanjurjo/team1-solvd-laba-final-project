"use client";

import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/style/theme";
import { CssBaseline } from "@mui/material";

/**
 * @function
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The children to render.
 * @returns {JSX.Element} The providers factory component.
 *
 * @example
 * const providersFactory = ProvidersFactory({
 *   children: <App />,
 * });
 */
export default function ProvidersFactory({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
