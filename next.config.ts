import type { NextConfig } from "next";

// Deployed to https://aulad23.github.io/ (a USERNAME.github.io repo), so basePath is "".
// Set NEXT_PUBLIC_BASE_PATH (e.g. "/repo-name") only if the site moves to a project repository.
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
