import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales: ['tr', 'en'],
  
  // Used when no locale matches
  defaultLocale: 'tr',
  
  // Don't use a prefix for the default locale
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … files in the public folder
  // - … files with a file extension (e.g. favicon.ico)
  // - … Next.js internal files
  matcher: [
    '/((?!_next|favicon|.*\\.|api).*)',
    '/'
  ]
};
