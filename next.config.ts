import type { NextConfig } from 'next';
// A single static page needs prefixed assets, not server-side route mounting.
const nextConfig: NextConfig = { output: 'export', assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '', images: { unoptimized: true } };
export default nextConfig;
