import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // dynamicIO: true,
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagsapi.com',
        port: '',
        pathname: '/**/flat/64.png',
        search: '',
      },
    ],
  },
};

export default nextConfig;
