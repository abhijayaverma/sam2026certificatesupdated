import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@napi-rs/canvas'],
  outputFileTracingIncludes: {
    '/api/generate': ['./assets/fonts/**'],
    '/api/download': ['./assets/fonts/**'],
  },
};

export default nextConfig;