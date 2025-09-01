import { MEMBERSHIP_ROLE_VALUE, VARIANT_IDS_BY_TYPE } from "@/lib/constants";
import { creem } from "@/lib/creem/client";
import { getUserCreemSubscriptionPlan } from "@/lib/creem/subscription";
import prisma from "@/lib/prisma";
import { unauthorizedResponse } from "@/lib/response/responseUtils";
import { verifyReferer, verifyToken } from "@/lib/verifyUtils/verifyUtils";
import { UpgradeType } from "@/types/subscribe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 判断referer
    if (!(await verifyReferer(request))) {
      console.log('Referer verification failed:', request.headers.get('referer'));
      return unauthorizedResponse("Invalid referer.");
    }
    
    // 判断token是否存在
    const redisUserId: string | false = await verifyToken(request);
    if (!redisUserId) {
      console.log('Token verification failed');
      return unauthorizedResponse("Token validation failed. Please login again.");
    }

    const { userId, type }: { userId: string, type: UpgradeType } = await request.json()
    console.log('Request data:', { userId, type, redisUserId });
    
    if (!userId) {
      console.log('No userId in request body');
      return unauthorizedResponse("Your account was not found");
    }
    const variantId = VARIANT_IDS_BY_TYPE[type]
    if (!type || !variantId) {
      return unauthorizedResponse("Your account was not found");
    }

    const user = await prisma.user.findUnique({
      where: { userId: userId.toString() },
      select: { userId: true, email: true, username: true },
    });

    if (!user) return NextResponse.json({ message: "user not found" }, { status: 401 });

    // 创建 Creem 结账会话
    // Create Creem checkout session
    const checkoutResponse = await creem.createCheckout({
      product_id: variantId.toString(),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      metadata: {
        userId: user.userId,
        email: user.email,
        username: user.username,
        type
      }
    });
    
    return NextResponse.json({ checkoutURL: checkoutResponse.checkout_url }, { status: 200 });
  } catch (error: any) {
    console.error('POST request failed:', error);
    return NextResponse.json({
      error: "An unexpected error occurred. Please try again later."
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // 判断referer
    // Check the referer
    if (!(await verifyReferer(request))) {
      return unauthorizedResponse("Invalid referer.");
    }
    // 判断token是否存在
    // Verify if token exists
    const redisUserId: string | false = await verifyToken(request);
    if (!redisUserId) {
      return unauthorizedResponse("Token validation failed. Please login again.");
    }

    // 查询 Creem 订阅信息
    // Query Creem subscription information
    const subscriptionPlan = await getUserCreemSubscriptionPlan({ userId: redisUserId });
    
    // 校验角色
    // Validate roles
    if (!subscriptionPlan) {
      const errorText = `you're not a pro user.`
      return NextResponse.json({ message: errorText }, { status: 401 });
    }
    if (subscriptionPlan.role !== MEMBERSHIP_ROLE_VALUE) {
      const errorText = `you're not a pro user.`
      return NextResponse.json({ message: errorText }, { status: 401 });
    }
    // 校验订阅状态
    // Check the subscription status
    if (subscriptionPlan.isCanceled) {
      const errorText = `your subscription already canceled.`
      return NextResponse.json({ message: errorText }, { status: 401 });
    }

    // 取消 Creem 订阅
    // Cancel Creem subscription
    try {
      const cancelResponse = await creem.cancelSubscription(String(subscriptionPlan.subscriptionId));
      // 检查订阅是否设置为在周期结束时取消
      if (cancelResponse.cancel_at_period_end) {
        return NextResponse.json({ message: 'success' }, { status: 200 });
      }
      return NextResponse.json({ message: 'fail' }, { status: 400 });
    } catch (error) {
      return NextResponse.json({ message: 'cancel failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('DELETE request failed:', error);
    return NextResponse.json({
      error: "An unexpected error occurred. Please try again later."
    }, { status: 500 });
  }
}