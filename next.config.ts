import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'parksideharmony.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
