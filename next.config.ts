import type { NextConfig } from "next";

// Security headers configuration
const securityHeaders = [
  {
    // Content Security Policy - controls which resources can be loaded
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self, inline (for Next.js), and eval (for development)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.googletagmanager.com",
      // Styles: self, inline (for Tailwind/styled components), and Google Fonts CSS
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: self, data URIs, and configured remote domains
      "img-src 'self' data: blob: https://parksideharmony.org https://*.public.blob.vercel-storage.com https://img.youtube.com https://i.ytimg.com",
      // Fonts: self, data URIs, and Google Fonts
      "font-src 'self' data: https://fonts.gstatic.com",
      // Connect: self and required external services
      "connect-src 'self' https://parksideharmony.org https://*.vercel-storage.com",
      // Frames: YouTube embeds only
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      // Prevent embedding this site in iframes on other domains
      "frame-ancestors 'self'",
      // Form submissions only to self
      "form-action 'self'",
      // Upgrade insecure requests
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    // Prevent clickjacking by disallowing iframe embedding
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Prevent MIME type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Control referrer information sent to other sites
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Disable browser features not needed by this site
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // Force HTTPS (preload requires submission to hstspreload.org)
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    // Enable XSS protection in older browsers
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  // Security headers for all routes
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
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
  // Increase body size limit for API routes (for image uploads)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
