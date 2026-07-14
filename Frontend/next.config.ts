import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  // The frontend talks to the Express API via NEXT_PUBLIC_API_URL.
  // No API secrets ever live here — only NEXT_PUBLIC_* is exposed to the browser.
};

export default nextConfig;
