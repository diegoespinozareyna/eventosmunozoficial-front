import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignora ESLint durante `next build`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
