import path from "node:path";
import type { NextConfig } from "next";

/**
 * Static export is opt-in via NEXT_OUTPUT_EXPORT=1 so that `next start` keeps
 * working locally. The GitHub Pages workflow sets it.
 */
const isExport = process.env.NEXT_OUTPUT_EXPORT === "1";

/**
 * Empty for a user site (https://<user>.github.io) or a custom domain.
 * "/repo-name" for a project site (https://<user>.github.io/repo-name).
 * The workflow derives this automatically.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Pin the workspace root. Without this, Turbopack walks up the directory tree
  // looking for a lockfile and can settle on the user's home directory.
  turbopack: {
    root: path.resolve(process.cwd()),
  },

  ...(isExport ? { output: "export" as const } : {}),

  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  // GitHub Pages serves /about as /about/index.html, so emit directory-style
  // routes rather than about.html.
  trailingSlash: true,

  images: {
    // No image optimizer exists on a static host.
    unoptimized: true,
  },
};

export default nextConfig;
