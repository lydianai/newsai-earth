const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: __dirname,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has TypeScript errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  images: {
    domains: [
      "openweathermap.org",
      "newsai.earth", 
      "images.unsplash.com",
      "pbs.twimg.com",
      "cdn.jsdelivr.net",
      "localhost",
    ],
  },
};

module.exports = withNextIntl(nextConfig);
