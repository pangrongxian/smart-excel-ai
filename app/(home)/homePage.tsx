"use client";

import Subscribe from "@/components/subscribe/Subscribe";
import { useLanguage } from "@/hooks/useLanguage";
import { UserInfo } from "@/types/user";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

interface HomePageProps {
  user: UserInfo | null;
}

export default function HomePage({ user }: HomePageProps) {
  const { locale } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8">
      {/* 主标题区域 */}
      <div className="text-center mb-8">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900 mb-6">
          欢迎使用我们的平台
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          这是一个简洁的页面模板，您可以在此基础上构建您的应用。
        </p>
      </div>

      {/* 用户信息/登录区域 */}
      <div className="max-w-xl w-full mb-12">
        {user ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-6">
              欢迎回来，{user.username || user.email}！
            </p>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">用户信息</h2>
              <div className="space-y-3 text-left">
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">用户名:</span> 
                  <span className="text-gray-800">{user.username || '未设置'}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">邮箱:</span> 
                  <span className="text-gray-800">{user.email}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">角色:</span> 
                  <span className="text-gray-800">{user.role === 0 ? '普通用户' : '会员用户'}</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-8">
              请登录以访问更多功能
            </p>
            <Link href={`/${locale}/login`}>
              <button className="bg-black rounded-xl text-white font-medium px-8 py-4 hover:bg-black/80 transition-colors shadow-lg">
                立即登录 →
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* 分隔线 */}
      <div className="w-full max-w-4xl">
        <hr className="border-gray-300 my-12" />
      </div>
      
      {/* 介绍区域 */}
      <div className="text-center mb-12 max-w-4xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">开始构建您的应用</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          这是一个干净的页面模板。为您提供一个简洁的起点。
        </p>
      </div>

      {/* 订阅组件区域 */}
      <div className="w-full max-w-6xl">
        <Subscribe user={user} />
      </div>

      {/* Toast 通知 */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
    </div>
  );
}
