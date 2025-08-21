const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === "development",
  // 移除 swcMinify，Next.js 15 中已默认启用
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "weijunext.com",
      "smartexcel.cc",
    ],
  },
  // 设置输出文件追踪根目录以消除警告
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/weijunext/smart-excel-ai",
        permanent: false,
      },
    ];
  },
  // 添加 webpack 配置以处理 Contentlayer 问题
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = withContentlayer(nextConfig);
