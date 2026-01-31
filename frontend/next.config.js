/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    // Fedora/Dockerでのホットリロード対策
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // 1秒ごとにポーリング
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  // ファイル監視の設定
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;