import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://payload:3000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
