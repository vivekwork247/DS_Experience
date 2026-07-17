import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for self-hosted (bun) deployments only.
  // Vercel sets process.env.VERCEL='1', so standalone is skipped there.
  output: process.env.VERCEL ? undefined : "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
