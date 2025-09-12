import createIntlMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createIntlMiddleware({
  locales,
  defaultLocale: 'tr',
  localeDetection: true
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\.).*)']
};
