import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [new URL("https://*.supabase.co/**")],
  },
};

export default nextConfig;
