
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === "development",
  images: {
    // 使用新的 remotePatterns 配置替代已弃用的 domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'weijunext.com',
      },
      {
        protocol: 'https',
        hostname: 'smartexcel.cc',
      },
    ],
    // SVG 支持配置
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox; img-src 'self' data: blob:;",
    // 添加本地域名支持
    domains: ['localhost'],
  },
  // 添加静态文件处理
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/weijunext/smart-excel-ai",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:locale/billing',
        destination: '/billing',
      },
    ];
  },
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

module.exports = withNextIntl(nextConfig);
