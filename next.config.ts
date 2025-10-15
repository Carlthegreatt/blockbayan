import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["fs"],
  // Ensure proper handling of static files
  trailingSlash: false,
  // Optimize for production
  compress: true,
};

export default nextConfig;
