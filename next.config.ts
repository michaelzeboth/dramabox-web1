import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "hwztchapter.dramaboxdb.com" },
      { protocol: "https", hostname: "thwztchapter.dramaboxdb.com" },
      { protocol: "https", hostname: "thwztvideo.dramaboxdb.com" },
      { protocol: "https", hostname: "hwztvideo.dramaboxdb.com" },
      { protocol: "https", hostname: "dramaboxdb.com" },
    ],
  },
};

export default nextConfig;
