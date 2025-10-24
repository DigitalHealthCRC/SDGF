/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',                // ✅ replaces "next export"
  images: { unoptimized: true },   // GitHub Pages has no Image Optimization
  basePath: '/SDGF',               // your repo name (for correct URLs)
  assetPrefix: '/SDGF/',           // ensures CSS/JS load under Pages path
};

export default nextConfig;
