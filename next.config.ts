import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'payload',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL || 'http://payload:3000/api/:path*',
      },
      {
        source: '/media/:path*',
        destination: process.env.API_URL ? `${process.env.API_URL}/media/:path*` : 'http://payload:3000/media/:path*',
      },
    ]
  },
};

export default nextConfig;
