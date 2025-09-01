import { ONE_DAY, getSinglePayOrderKey } from "@/lib/constants";
import { creem } from "@/lib/creem/client";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { boostPack } from "@/lib/upgrade/upgrade";
import { clearTodayUsage } from "@/lib/usage/usage";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import dayjs from "dayjs";

export async function POST(request: Request) {
  console.log('Creem webhook received');
  
  try {
    const body = await request.text();
    const headersList = headers();
    const payload = JSON.parse(body);

    // Verify webhook signature
    const signature = headersList.get("x-signature");
    if (!signature) {
      console.error('Creem webhook: Signature header not found');
      return NextResponse.json({ message: "Signature header not found" }, { status: 401 });
    }

    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET as string;
    if (!creem.verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('Creem webhook: Invalid signature');
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const { event_type, data } = payload;
    const userId = data.metadata?.userId;

    if (!userId) {
      console.error('Creem webhook: No userId in metadata');
      return NextResponse.json({ message: "No userId provided" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { userId: userId.toString() },
      select: { userId: true, email: true, username: true },
    });

    if (!user) {
      console.error('Creem webhook: User not found');
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    switch (event_type) {
      case 'payment.succeeded': {
        return await handlePaymentSucceeded(data, userId);
      }
      
      case 'subscription.created': {
        return await handleSubscriptionCreated(data, userId);
      }
      
      case 'subscription.updated': {
        return await handleSubscriptionUpdated(data, userId);
      }
      
      case 'subscription.cancelled': {
        return await handleSubscriptionCancelled(data, userId);
      }
      
      default: {
        console.log(`Creem webhook: Unhandled event type: ${event_type}`);
        return NextResponse.json({ message: 'Event type not supported' }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('Creem webhook error:', error);
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentSucceeded(data: any, userId: string) {
  try {
    // Check if this is a one-time payment
    if (data.product_id === process.env.CREEM_MEMBERSHIP_SINGLE_PRODUCT_ID) {
      // Handle single payment (boost pack)
      const key = getSinglePayOrderKey({ identifier: data.order_id });
      const orderRedisRes = await redis.get(key);
      
      if (!orderRedisRes) {
        await redis.setex(key, ONE_DAY, data.created_at);
        await boostPack({ userId });
      }
    }
    
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
    return NextResponse.json({ message: 'Payment processing failed' }, { status: 500 });
  }
}

async function handleSubscriptionCreated(data: any, userId: string) {
  try {
    await prisma.user.update({
      where: { userId },
      data: {
        subscriptionId: data.subscription_id,
        customerId: data.customer_id,
        variantId: 1, // Set appropriate variant ID for Creem
        currentPeriodEnd: dayjs(data.current_period_end).unix(),
      },
    });
    
    // Reset today's usage
    clearTodayUsage({ userId });
    
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error handling subscription created:', error);
    return NextResponse.json({ message: 'Subscription creation failed' }, { status: 500 });
  }
}

async function handleSubscriptionUpdated(data: any, userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { userId, subscriptionId: data.subscription_id },
      select: { subscriptionId: true },
    });
    
    if (!user || !user.subscriptionId) {
      return NextResponse.json({ message: 'Subscription not found' }, { status: 400 });
    }
    
    await prisma.user.update({
      where: { userId, subscriptionId: user.subscriptionId },
      data: {
        currentPeriodEnd: dayjs(data.current_period_end).unix(),
      },
    });
    
    // Reset today's usage
    clearTodayUsage({ userId });
    
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error handling subscription updated:', error);
    return NextResponse.json({ message: 'Subscription update failed' }, { status: 500 });
  }
}

async function handleSubscriptionCancelled(data: any, userId: string) {
  try {
    // You might want to keep the subscription active until the end of the current period
    // or immediately revoke access depending on your business logic
    
    console.log(`Subscription cancelled for user ${userId}: ${data.subscription_id}`);
    
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
    return NextResponse.json({ message: 'Subscription cancellation failed' }, { status: 500 });
  }
}