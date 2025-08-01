import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL(
        "https://www.opensports.com.ar/media/catalog/product/cache/4cbe9863fc1e4aa316955fdd123a5af3/I/H/IH2636_0.jpg"
      ),
    ],
  },
};

export default nextConfig;
