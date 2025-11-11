import { ONE_DAY } from "@/lib/constants";
import { getUserCreemSubscriptionStatus } from "@/lib/creem/subscription";
import prisma from "@/lib/prisma";
import { UserInfo } from "@/types/user";
import { Account, NextAuthOptions, TokenSet } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import redis from "./redis";

// Here you define the type for the token object that includes accessToken.
interface ExtendedToken extends TokenSet {
  accessToken?: string;
  userId?: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/zh/login",  // 修改为包含语言前缀的路径
    signOut: '/zh/auth/logout',
  },
  providers: [
    GithubProvider({
      clientId: `${process.env.GITHUB_ID}`,
      clientSecret: `${process.env.GITHUB_SECRET}`,
      httpOptions: {
        timeout: 50000,
      },
    }),
    GoogleProvider({
      clientId: `${process.env.GOOGLE_ID}`,
      clientSecret: `${process.env.GOOGLE_SECRET}`,
      httpOptions: {
        timeout: 50000,
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // 登录(account仅登录那一次有值)
      // Only on sign in (account only has a value at that time)
      if (account) {
        token.accessToken = account.access_token

        // 存储访问令牌
        // Store the access token
        await storeAccessToken(account.access_token || '', token.sub);

        // 用户信息存入数据库
        // Save user information in the database
        const userInfo = await upsertUserAndGetInfo(token, account);
        if (!userInfo || !userInfo.userId) {
          throw new Error('User information could not be saved or retrieved.');
        }

        const planRes = await getUserCreemSubscriptionStatus({ userId: userInfo.userId, defaultUser: userInfo })
        const fullUserInfo = {
          userId: userInfo.userId,
          username: userInfo.username,
          avatar: userInfo.avatar,
          email: userInfo.email,
          platform: userInfo.platform,
          role: planRes.role,
          membershipExpire: planRes.membershipExpire,
          accessToken: account.access_token
        }
        return fullUserInfo
      }
      return token as any
    },
    async session({ session, token }) {
      // Append user information to the session
      if (token && token.userId) {
        session.user = await getSessionUser(token);
      }
      return session;
    },
    // 添加重定向回调
    async redirect({ url, baseUrl }) {
      // 处理相对路径：避免重复添加语言前缀，如 '/zh' 被加成 '/zh/zh'
      if (url.startsWith("/")) {
        // 根路径，跳转到默认语言首页
        if (url === "/") return `${baseUrl}/zh`;
        // 已带语言前缀的路径，保持不变
        if (url.startsWith("/zh") || url.startsWith("/en")) {
          return `${baseUrl}${url}`;
        }
        // 无语言前缀的相对路径，补充默认语言
        return `${baseUrl}/zh${url}`;
      }
      // 处理同域完整 URL：如果不带语言前缀，补充默认语言
      if (url.startsWith(baseUrl)) {
        const path = url.replace(baseUrl, "");
        if (path.startsWith("/zh") || path.startsWith("/en")) {
          return url;
        }
        return `${baseUrl}/zh${path === "" ? "" : path}`;
      }
      // 其他域名或外链，保持原样
      return url;
    }
  },
}
async function storeAccessToken(accessToken: string, sub?: string) {
  if (!accessToken || !sub) return;
  // 在本地开发或未配置 Upstash 时，跳过令牌缓存，避免授权流程因网络或配置失败
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('[storeAccessToken] Upstash Redis not configured, skip caching access token');
    return;
  }
  const expire = ONE_DAY * 30; // The number of seconds in 30 days
  try {
    await redis.set(accessToken, sub, { ex: expire });
  } catch (err) {
    console.warn('[storeAccessToken] Failed to cache access token, continue without cache:', err);
  }
}
async function upsertUserAndGetInfo(token: JWT, account: Account) {
  const user = await upsertUser(token, account.provider);
  if (!user || !user.userId) return null;

  const subscriptionStatus = await getUserCreemSubscriptionStatus({ userId: user.userId, defaultUser: user });

  return {
    ...user,
    role: subscriptionStatus.role,
    membershipExpire: subscriptionStatus.membershipExpire,
  };
}
async function upsertUser(token: JWT, provider: string) {
  const userData = {
    userId: token.sub || '',
    username: token.name || 'User', // 提供默认值，避免 null
    avatar: token.picture,
    email: token.email || '', // 提供默认值，避免 null
    platform: provider,
  };

  const user = await prisma.user.upsert({
    where: { userId: token.sub },
    update: userData,
    create: { ...userData, role: 0 },
  });

  return user || null;
}
async function getSessionUser(token: ExtendedToken): Promise<UserInfo> {
  const planRes = await getUserCreemSubscriptionStatus({ userId: token.userId as string });
  return {
    userId: token.userId,
    username: token.username,
    avatar: token.avatar,
    email: token.email,
    platform: token.platform,
    role: planRes.role,
    membershipExpire: planRes.membershipExpire,
    accessToken: token.accessToken
  } as UserInfo;
}
