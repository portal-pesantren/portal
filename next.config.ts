import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily disable static export to fix dynamic routes
  // output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // distDir: 'out',
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
