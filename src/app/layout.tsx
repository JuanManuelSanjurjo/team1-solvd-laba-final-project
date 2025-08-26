import type { Metadata } from "next";

import "./globals.css";

import { worksans, nunitosans } from "@/style/fonts";
import { Header } from "@/components/header/Header";
import ProvidersFactory from "@/providers/ProvidersFactory";
import { auth } from "@/auth";
import ToastHost from "@/components/ToastHost";

export const metadata: Metadata = {
  title: {
    template: "%s | Shoes Shop",
    default: "Shoes Shop",
  },
  description: "Shoes Shop - Your one-stop shop for all your shoe needs",
  keywords: ["shoes", "clothing", "ecommerce"],
  authors: [{ name: "Shoes Shop" }],
  creator: "Shoes Shop",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
          <ToastHost />
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
