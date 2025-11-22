import type { NextConfig } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [SITE_URL],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
      ],
    },
    {
      source: "/service-worker.js",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
      ],
    },
  ],
};

export default nextConfig;
