import { MEMBERSHIP_ROLE_VALUE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { SubScriptionInfo } from "@/types/subscribe";
import { UserId } from "@/types/user";
import { creem } from "./client";

export async function getUserCreemSubscriptionPlan({ userId }: UserId) {
  const user = await prisma.user.findUnique({
    where: { userId },
    select: {
      subscriptionId: true,
      currentPeriodEnd: true,
      customerId: true,
      variantId: true,
    },
  });

  if (!user) throw new Error("User not found");
  if (!user.subscriptionId) return null;

  const membershipExpire = (user.currentPeriodEnd || 0) * 1000;
  
  try {
    const subscription = await creem.getSubscription(user.subscriptionId);

    // Check if user is on a pro plan
    const isMembership = user.variantId && membershipExpire > Date.now().valueOf();

    // Check if subscription is canceled
    const isCanceled = subscription.cancel_at_period_end;

    return {
      subscriptionId: user.subscriptionId,
      membershipExpire: isMembership ? membershipExpire : 0,
      customerId: user.customerId,
      variantId: user.variantId,
      role: isMembership ? MEMBERSHIP_ROLE_VALUE : 0,
      isCanceled,
      // Creem doesn't provide direct update payment method URLs like Lemon Squeezy
      // Users need to contact support or cancel and resubscribe
      updatePaymentMethodURL: undefined,
      customerPortal: undefined,
    } as SubScriptionInfo;
  } catch (error) {
    console.error('Error fetching Creem subscription:', error);
    return null;
  }
}

export async function getUserCreemSubscriptionStatus({ userId, defaultUser }: { userId: string; defaultUser?: any }) {
  let user = null;
  if (defaultUser) {
    user = defaultUser;
  } else {
    user = await prisma.user.findUnique({
      where: { userId },
      select: {
        subscriptionId: true,
        currentPeriodEnd: true,
        customerId: true,
        variantId: true,
      },
    });
  }

  if (!user) throw new Error("User not found");

  const membershipExpire = (user.currentPeriodEnd || 0) * 1000;
  const isMembership = user.variantId && membershipExpire > Date.now().valueOf();

  return {
    subscriptionId: user.subscriptionId,
    membershipExpire: isMembership ? membershipExpire : 0,
    customerId: user.customerId,
    variantId: user.variantId,
    role: isMembership ? MEMBERSHIP_ROLE_VALUE : 0,
  } as SubScriptionInfo;
}