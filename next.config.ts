import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/arab',
        destination: '/',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.tildacdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'optim.tildacdn.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
