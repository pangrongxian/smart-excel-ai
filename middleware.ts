import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // 支持的语言列表
  locales,
  // 默认语言
  defaultLocale,
  // 禁用语言检测策略，避免覆盖用户选择
  localeDetection: false,
  // 本地化前缀策略
  localePrefix: 'always'
});

export const config = {
  // 确保排除所有静态资源，包括音频文件
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|voice|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav|ogg)$).*)'],
};