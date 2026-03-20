import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for Docker (works on Linux/macOS; on Windows use npm run dev)
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
};

export default nextConfig;
