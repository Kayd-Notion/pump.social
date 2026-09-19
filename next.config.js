/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for future decentralized hosting (IPFS / Arweave).
  output: 'export',
  reactStrictMode: true,
  // `next/image` optimization requires a server; disable it for static export.
  images: {
    unoptimized: true,
  },
  // Emit `path/index.html` so routes resolve on static hosts without rewrites.
  trailingSlash: true,
};

module.exports = nextConfig;
