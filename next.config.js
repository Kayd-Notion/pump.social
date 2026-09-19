/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for future decentralized hosting (IPFS / Arweave).
  //
  // Applied to production builds only: `next dev` has a limitation where
  // dynamic routes error under `output: 'export'` even with valid
  // `generateStaticParams`. Scoping it to the build keeps local dev working
  // while `npm run build` still emits a fully static site to ./out.
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  reactStrictMode: true,
  // `next/image` optimization requires a server; disable it for static export.
  images: {
    unoptimized: true,
  },
  // Emit `path/index.html` so routes resolve on static hosts without rewrites.
  trailingSlash: true,
};

module.exports = nextConfig;
