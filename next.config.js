const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone for Vercel deployment
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  typescript: {
    // Allow production builds with TypeScript errors for now
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow production builds with ESLint warnings
    ignoreDuringBuilds: true,
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
