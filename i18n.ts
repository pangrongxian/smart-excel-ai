import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 支持的语言列表
export const locales = ['zh', 'en'] as const;
export type Locale = typeof locales[number];

// 默认语言
export const defaultLocale: Locale = 'zh';

export default getRequestConfig(async ({ requestLocale }) => {
  // 获取实际的 locale 值
  const locale = await requestLocale;
  
  // 如果 locale 为 undefined 或不在支持列表中，使用默认语言
  const validLocale = locale && locales.includes(locale as Locale) ? locale : defaultLocale;
  
  // 如果传入的 locale 无效且不是 undefined，返回 404
  if (locale && !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});