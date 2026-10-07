/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import { ContractParseError, isRecord } from "./guard.js";

export const CHECKOUT_STATES = ["none", "processing", "succeeded", "declined", "cancelled", "incomplete"] as const;
export type CheckoutState = (typeof CHECKOUT_STATES)[number];

export const PAYMENT_STATES = ["ok", "needs_payment_method", "failed"] as const;
export type PaymentState = (typeof PAYMENT_STATES)[number];

export const BILLING_EVENT_NAMES = ["checkout.updated", "subscription.updated", "payment.failed"] as const;
export type BillingEventName = (typeof BILLING_EVENT_NAMES)[number];

export interface UsageMeter {
  key: string;
  used: number;
  limit: number;
}

export interface BillingSnapshot {
  planId: string;
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
  paymentState: PaymentState;
  checkoutState: CheckoutState;
  entitlements: Record<string, boolean>;
  usage: UsageMeter[];
}

export type CheckoutResult =
  | { status: "redirect"; url: string }
  | { status: "pending" }
  | { status: "embedded"; clientSecret: string };

export interface BillingEvent {
  name: BillingEventName;
  occurredAt: string;
}

function isCheckoutState(value: unknown): value is CheckoutState {
  return typeof value === "string" && CHECKOUT_STATES.some((state) => state === value);
}

function isPaymentState(value: unknown): value is PaymentState {
  return typeof value === "string" && PAYMENT_STATES.some((state) => state === value);
}

function parseUsage(value: unknown): UsageMeter {
  if (
    !isRecord(value) ||
    typeof value["key"] !== "string" ||
    value["key"].length === 0 ||
    typeof value["used"] !== "number" ||
    !Number.isFinite(value["used"]) ||
    value["used"] < 0 ||
    typeof value["limit"] !== "number" ||
    !Number.isFinite(value["limit"]) ||
    value["limit"] < 0
  ) {
    throw new ContractParseError("Usage meter is missing key, used, or limit");
  }
  return { key: value["key"], used: value["used"], limit: value["limit"] };
}

export function parseBillingSnapshot(value: unknown): BillingSnapshot {
  if (
    !isRecord(value) ||
    typeof value["planId"] !== "string" ||
    value["planId"].length === 0 ||
    (value["renewsAt"] !== null && typeof value["renewsAt"] !== "string") ||
    typeof value["cancelAtPeriodEnd"] !== "boolean" ||
    !isPaymentState(value["paymentState"]) ||
    !isCheckoutState(value["checkoutState"]) ||
    !isRecord(value["entitlements"]) ||
    !Array.isArray(value["usage"])
  ) {
    throw new ContractParseError("Billing snapshot does not match the contract");
  }
  const entitlements: Record<string, boolean> = {};
  for (const [key, enabled] of Object.entries(value["entitlements"])) {
    if (typeof enabled !== "boolean") {
      throw new ContractParseError("Entitlement values must be booleans");
    }
    entitlements[key] = enabled;
  }
  return {
    planId: value["planId"],
    renewsAt: value["renewsAt"],
    cancelAtPeriodEnd: value["cancelAtPeriodEnd"],
    paymentState: value["paymentState"],
    checkoutState: value["checkoutState"],
    entitlements,
    usage: value["usage"].map((meter) => parseUsage(meter)),
  };
}

export function parseCheckoutResult(value: unknown): CheckoutResult {
  if (!isRecord(value)) {
    throw new ContractParseError("Checkout result does not match the contract");
  }
  if (value["status"] === "pending") {
    return { status: "pending" };
  }
  if (value["status"] === "redirect" && typeof value["url"] === "string" && value["url"].length > 0) {
    return { status: "redirect", url: value["url"] };
  }
  if (value["status"] === "embedded" && typeof value["clientSecret"] === "string" && value["clientSecret"].length > 0) {
    return { status: "embedded", clientSecret: value["clientSecret"] };
  }
  throw new ContractParseError("Checkout result does not match the contract");
}

export function parseBillingEvent(value: unknown): BillingEvent {
  if (
    !isRecord(value) ||
    (value["name"] !== "checkout.updated" && value["name"] !== "subscription.updated" && value["name"] !== "payment.failed") ||
    typeof value["occurredAt"] !== "string" ||
    value["occurredAt"].length === 0
  ) {
    throw new ContractParseError("Billing event does not match the contract");
  }
  return { name: value["name"], occurredAt: value["occurredAt"] };
}
