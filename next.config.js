/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const isProd = process.env.NEXT_PUBLIC_ENV_KEY === 'production';
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['p3-juejin.byteimg.com', 'fastly.picsum.photos']
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(rule =>
      rule.test?.test?.('.svg')
    );
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/ // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack']
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  compiler: {
    removeConsole: isProd
      ? {
          exclude: ['error']
        }
      : false
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, must-revalidate'
          }
        ]
      },
      {
        source: '/:all*(svg|jpg|png|webp|ico)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, must-revalidate'
          }
        ]
      }
    ];
  }
};

module.exports = withNextIntl(nextConfig);
