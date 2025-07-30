import type { Metadata } from "next";
import ReactQueryProvider from "../utils/providers/ReactQueryProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import theme from "@/style/theme";
import { ThemeProvider } from "@mui/material/styles";
import { worksans, nunitosans } from "@/style/fonts";
import { CssBaseline } from "@mui/material";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Shoes Shop",
  description: "Shoes Shop",
  icons: {
    icon: "/assets/logo/logo-orange.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${worksans.variable} ${nunitosans.variable}`}>
        <ReactQueryProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <main>
                <Header isAuthenticated={true} />
                {children}
              </main>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
