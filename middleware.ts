import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import createMiddleware from 'next-intl/middleware';
import { localePrefix } from '@/i18n/navigation';
import { locales, defaultLocale } from './i18n/i18nConfig';

acceptLanguage.languages(locales);
// export const config = {
//   matcher: [
//       '/((?!api|_next/static|_next/image|favicon.ico|assets|public|sw.js).*)'
//     ]
// };

export const config = {
  matcher: [
    //在根目录中启用重定向到匹配的区域设置
    '/',
    //设置cookie以记住以前的区域设置
    //所有具有区域设置前缀的请求
    '/(zh|en)/:path*',
    //启用添加缺失区域设置的重定向
    //（例如`/pathnames`->`/en/pathnames`）
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // const sessionTokenCookieName = `${
  //   process.env.NODE_ENV === 'development' ? '' : '__Secure-'
  // }next-auth.session-token`;
  // console.log(sessionTokenCookieName);

  const sessionToken =
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;

  if (pathname.includes('/login')) {
    if (sessionToken) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  const handleI18nRouting = createMiddleware({
    locales,
    localePrefix,
    defaultLocale,
    localeDetection: false
  });

  const response = handleI18nRouting(req);

  return response;
}
