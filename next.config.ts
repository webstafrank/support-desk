import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
        os: false,
        path: false,
        v8: false,
      };
    }
    return config;
  },
};

export default nextConfig;
