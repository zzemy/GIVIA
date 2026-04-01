import type { NextConfig } from "next";

const internalHost = process.env.TAURI_DEV_HOST || "localhost";

// Enable static export for Tauri production builds and Vercel deployment.
// This makes `pnpm build` generate the `out/` directory that Tauri loads from `src-tauri/tauri.conf.json` (frontendDist: "../out").
const nextConfig: NextConfig = {
  // Note: This feature is required to use the Next.js Image component in SSG mode.
  // See https://nextjs.org/docs/messages/export-image-api for different workarounds.
  images: {
    unoptimized: true,
  },
  // Configure assetPrefix for development mode.
  assetPrefix: process.env.NODE_ENV === "production" ? undefined : `http://${internalHost}:3000`,
  output: "export",
};

export default nextConfig;
