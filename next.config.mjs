const DEFAULT_BASE_PATH = '/SDGF'
const DEFAULT_ASSET_PREFIX = `${DEFAULT_BASE_PATH}/`

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || DEFAULT_BASE_PATH
const ASSET_PREFIX = process.env.NEXT_PUBLIC_ASSET_PREFIX || DEFAULT_ASSET_PREFIX

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',              // replaces "next export"
  images: { unoptimized: true }, // GitHub Pages has no Image Optimization
  basePath: BASE_PATH,           // GitHub Pages repo name (for correct URLs)
  assetPrefix: ASSET_PREFIX,     // ensures CSS/JS load under Pages path
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH, // surface base path to client/runtime scripts
  },
};

export default nextConfig;
