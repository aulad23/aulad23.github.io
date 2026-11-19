import type { NextConfig } from "next";

// Deployed to https://aulad23.github.io/aulad-portfolio/ → basePath "/aulad-portfolio".
// Set NEXT_PUBLIC_BASE_PATH="" when deploying to a USERNAME.github.io repository.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_BUILD_ID: String(Date.now()),
  },
};

export default nextConfig;
