import type { Metadata } from "next";
import "./globals.css";
import { worksans, nunitosans } from "@/style/fonts";
import { Header } from "@/components/Header";
import ProvidersFactory from "@/utils/providers/ProvidersFactory";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Shoes Shop",
  description: "Shoes Shop",
  icons: {
    icon: "/assets/logo/logo-orange.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${worksans.variable} ${nunitosans.variable}`}>
        <ProvidersFactory>
          <main>
            <Header session={session} />
            {/* We'll update this component next */}
            {children}
          </main>
        </ProvidersFactory>
      </body>
    </html>
  );
}
