"use client";

import Subscribe from "@/components/subscribe/Subscribe";
import { UserInfo } from "@/types/user";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

interface HomePageProps {
  user: UserInfo | null;
}

export default function HomePage({ user }: HomePageProps) {
  return (
    <>
      <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
        欢迎使用我们的平台
      </h1>

      <p className="text-slate-500 mt-5">
        这是一个简洁的页面模板，您可以在此基础上构建您的应用。
      </p>

      <div className="max-w-xl w-full mt-10">
        {user ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">
              欢迎回来，{user.username || user.email}！
            </p>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">用户信息</h2>
              <div className="space-y-2 text-left">
                <p><span className="font-medium">用户名:</span> {user.username || '未设置'}</p>
                <p><span className="font-medium">邮箱:</span> {user.email}</p>
                <p><span className="font-medium">角色:</span> {user.role === 0 ? '普通用户' : '会员用户'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-6">
              请登录以访问更多功能
            </p>
            <Link href="/login">
              <button className="bg-black rounded-xl text-white font-medium px-6 py-3 hover:bg-black/80 transition-colors">
                立即登录 &rarr;
              </button>
            </Link>
          </div>
        )}
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      
      <hr className="h-px bg-gray-700 border-1 mt-10" />
      
      <div className="space-y-10 my-10">
        <div className="text-center text-gray-500">
          <h2 className="text-2xl font-semibold mb-4">开始构建您的应用</h2>
          <p className="max-w-2xl mx-auto">
            这是一个干净的页面模板。为您提供一个简洁的起点。
          </p>
        </div>
      </div>

      {/* 保留订阅组件，但可以根据需要移除 */}
      <Subscribe user={user} />
    </>
  );
}
