'use client';

import { locales, type Locale } from '@/i18n';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export function useLanguage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: Locale) => {
    if (newLocale === locale) return; // 如果是相同语言，直接返回
    
    // 处理 pathname 可能为 null 的情况
    let pathWithoutLocale = pathname || '/';
    
    // 移除当前语言前缀（如果存在）
    const localePattern = new RegExp(`^/(${locales.join('|')})(/|$)`);
    const match = pathWithoutLocale.match(localePattern);
    if (match) {
      pathWithoutLocale = pathWithoutLocale.replace(match[0], match[2] || '/');
    }
    
    // 确保路径以 / 开头
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale;
    }
    
    // 构建新的路径
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    // 使用 router.push 进行客户端导航，无需强制刷新
    router.push(newPath);
  };

  return {
    locale,
    locales,
    changeLanguage,
  };
}