/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com']
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Disable persistent caching to prevent cache corruption
    if (dev && !isServer) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;