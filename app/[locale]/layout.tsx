import BaiDuAnalytics from "@/app/BaiDuAnalytics";
import GoogleAnalytics from "@/app/GoogleAnalytics";
import { NextAuthProvider } from "@/app/providers";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/session";
import { UserInfo } from "@/types/user";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { notFound } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'site' });
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    authors: [
      {
        name: "weijunext",
        url: "https://weijunext.com",
      }
    ],
    creator: '@weijunext',
    themeColor: '#fff',
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    metadataBase: new URL('https://smartexcel.cc'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://smartexcel.cc',
      siteName: t('title'),
      images: [
        {
          url: 'https://smartexcel.cc/og.png',
          width: 1200,
          height: 630,
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['https://smartexcel.cc/og.png'],
      creator: '@weijunext',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'zh-CN': '/zh',
        'en-US': '/en',
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // 验证 locale 是否有效
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // 获取消息
  const messages = await getMessages();
  const user = (await getCurrentUser()) as UserInfo;

  return (
    <NextIntlClientProvider messages={messages}>
      <NextAuthProvider>
        <Header user={user} />
        <div className="flex max-full mx-auto flex-col justify-center py-0 min-h-screen">
          <main className="flex-1 mt-20 flex justify-center">
            {children}
          </main>
          <Footer />
        </div>
      </NextAuthProvider>
    </NextIntlClientProvider>
  );
}