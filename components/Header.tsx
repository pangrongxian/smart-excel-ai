'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { UserInfo } from '@/types/user';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import DropDown from './DropDown';
import UserAccountHeader from './UserAccountHeader';

interface HeaderProps {
  user?: UserInfo | null;
}

export default function Header({ user }: HeaderProps) {
  const t = useTranslations('navigation');
  const { locale } = useLanguage();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand Section */}
          <div className="flex items-center space-x-4">
            <Link 
              href={`/${locale}`} 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white font-bold text-sm">
                SE
              </div>
              <span className="hidden sm:block text-xl font-semibold text-gray-900 tracking-tight">
                {t('home')}
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Language Dropdown */}
            <div className="w-24">
              <DropDown />
            </div>
            
            {/* User Account Section */}
            {user ? (
              <UserAccountHeader user={user} />
            ) : (
              <Link 
                href={`/${locale}/login`}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
