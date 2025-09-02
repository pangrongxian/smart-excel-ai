import { UserAuthForm } from "@/components/UserAuthForm";
import { getCurrentUser } from "@/lib/session";
import { UserInfo } from "@/types/user";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
// 移除 Image 导入
import Link from "next/link";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'auth' });
  
  return {
    title: t('signIn'),
    description: t('loginDescription'),
  };
}

export default async function LoginPage({ params: { locale } }: Props) {
  const user = (await getCurrentUser()) as UserInfo;
  const t = await getTranslations({ locale, namespace: 'auth' });

  return (
    <div className="container flex w-screen flex-col items-center justify-center">
      <div className="mx-auto flex flex-1 w-full flex-col justify-center space-y-6 sm:w-[350px] px-4">
        <div className="flex flex-col space-y-2 text-center">
          {/* 使用普通 img 标签替代 Next.js Image 组件 */}
          <img
            alt="logo"
            src="/logo.svg"
            className="sm:w-12 sm:h-12 w-6 h-6 mx-auto"
            width={32}
            height={32}
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('welcome')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('loginDescription')}
          </p>
        </div>
        <UserAuthForm user={user} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href={`/${locale}/privacy`}
            className="hover:text-brand underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}