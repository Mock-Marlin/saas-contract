/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import { createHmac, timingSafeEqual } from "node:crypto";

import type { BillingEvent, BillingEventName } from "../billing.js";

export { allowHttpsHost } from "./hosts.js";

const TOLERANCE_SECONDS = 300;

export class WebhookVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebhookVerificationError";
  }
}

export function secureEqual(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  if (leftBytes.length !== rightBytes.length) {
    return false;
  }
  return timingSafeEqual(leftBytes, rightBytes);
}

export function assertFreshTimestamp(timestampSeconds: number, nowMs = Date.now()): void {
  if (!Number.isFinite(timestampSeconds)) {
    throw new WebhookVerificationError("Webhook timestamp is invalid");
  }
  const skew = Math.abs(nowMs / 1000 - timestampSeconds);
  if (skew > TOLERANCE_SECONDS) {
    throw new WebhookVerificationError("Webhook timestamp is outside the tolerance window");
  }
}

export function signHex(secret: string | Buffer, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function signBase64(secret: Buffer, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64");
}

export function billingEventFromType(type: string, occurredAt: string): BillingEvent {
  const name: BillingEventName = type.includes("checkout")
    ? "checkout.updated"
    : type.includes("fail") || type.includes("dispute")
      ? "payment.failed"
      : "subscription.updated";
  return { name, occurredAt };
}

export function headerMap(headers: Record<string, string | string[] | undefined>): Record<string, string | undefined> {
  const mapped: Record<string, string | undefined> = {};
  for (const [name, value] of Object.entries(headers)) {
    mapped[name.toLowerCase()] = Array.isArray(value) ? value[0] : value;
  }
  return mapped;
}
