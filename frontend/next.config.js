/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },  
  images: {
    domains: [], // 必要に応じて外部ドメインを追加
  },
  // rewritesは削除（直接APIを呼び出すため）
};

module.exports = nextConfig;