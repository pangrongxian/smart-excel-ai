
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === "development",
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "weijunext.com",
      "smartexcel.cc",
    ],
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
module.exports = nextConfig;
