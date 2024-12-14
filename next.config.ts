import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ignoreDuringBuilds: true,
  images: {
    domains: [
      "res.cloudinary.com",
      "books.google.com",
      "cdn-icons-png.flaticon.com",
    ],
  },
};

export default nextConfig;
