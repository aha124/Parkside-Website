import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['parksideharmony.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'parksideharmony.org',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
