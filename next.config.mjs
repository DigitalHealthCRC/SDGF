const BASE_PATH = '/SDGF';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',              // replaces "next export"
  images: { unoptimized: true }, // GitHub Pages has no Image Optimization
  basePath: BASE_PATH,           // GitHub Pages repo name (for correct URLs)
  assetPrefix: `${BASE_PATH}/`,  // ensures CSS/JS load under Pages path
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH, // surface base path to client/runtime scripts
  },
};

export default nextConfig;
