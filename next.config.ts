import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  transpilePackages: ["three"],
};

export default nextConfig;
