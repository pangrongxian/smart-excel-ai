"use client";

import { signIn } from "next-auth/react";
import * as React from "react";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserInfo } from "@/types/user";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: UserInfo;
}

export function UserAuthForm({ className, user, ...props }: UserAuthFormProps) {
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const login = async (platform: string) => {
    // user已登录，返回首页
    if (user && user.userId) {
      toast.success("您已登录");
      router.push("/");
      return;
    }
    
    try {
      if (platform === "github") {
        setIsGitHubLoading(true);
      }
      if (platform === "google") {
        setIsGoogleLoading(true);
      }
      
      // 修改这里：使用 redirect: true 让 NextAuth 处理重定向
      await signIn(platform, {
        callbackUrl: `${window.location.origin}`,
        redirect: true,
      });
      
      // 由于使用了 redirect: true，以下代码不会执行
      // 登录成功后 NextAuth 会自动重定向到 callbackUrl
    } catch (error) {
      toast.error("登录过程中发生错误，请稍后重试");
      console.error("登录错误:", error);
    } finally {
      setIsGitHubLoading(false);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <button
        type="button"
        className={cn(buttonVariants())}
        onClick={() => login("google")}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </button>
      <Button
        variant="outline"
        className="border-gray-400"
        onClick={() => login("github")}
        disabled={isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
    </div>
  );
}
