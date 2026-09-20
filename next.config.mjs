/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Irys / Solana libs pull in optional node deps; keep them external on the server.
  serverExternalPackages: ["@irys/upload", "@irys/upload-solana"],
  images: {
    // Media is served from Arweave gateways.
    remotePatterns: [
      { protocol: "https", hostname: "arweave.net" },
      { protocol: "https", hostname: "gateway.irys.xyz" },
      { protocol: "https", hostname: "**.arweave.net" },
    ],
  },
};

export default nextConfig;
