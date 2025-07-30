import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignora ESLint durante `next build`
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'serverimages.inmobackend.site',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
