/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import type { BillingEvent } from "../billing.js";
import { isRecord } from "../guard.js";
import {
  WebhookVerificationError,
  assertFreshTimestamp,
  billingEventFromType,
  headerMap,
  secureEqual,
  signHex,
} from "./sign.js";

export { allowPaddleRedirect } from "./redirects.js";

export function verifyPaddleWebhook(
  rawBody: Buffer,
  headers: Record<string, string | string[] | undefined>,
  secret: string,
  nowMs = Date.now(),
): BillingEvent {
  const mapped = headerMap(headers);
  const signature = mapped["paddle-signature"];
  if (signature === undefined) {
    throw new WebhookVerificationError("Paddle webhook is missing Paddle-Signature");
  }
  const fields = new Map(signature.split(";").map((part) => {
    const [key, value] = part.split("=", 2);
    return [key ?? "", value ?? ""] as const;
  }));
  const timestamp = fields.get("ts");
  const digest = fields.get("h1");
  if (timestamp === undefined || digest === undefined || digest.length === 0) {
    throw new WebhookVerificationError("Paddle webhook signature is incomplete");
  }
  const seconds = Number(timestamp);
  assertFreshTimestamp(seconds, nowMs);
  const expected = signHex(secret, `${timestamp}:${rawBody.toString("utf8")}`);
  if (!secureEqual(digest, expected)) {
    throw new WebhookVerificationError("Paddle webhook signature does not match");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody.toString("utf8"));
  } catch {
    throw new WebhookVerificationError("Paddle webhook body is not JSON");
  }
  const type = isRecord(parsed) && typeof parsed["event_type"] === "string" ? parsed["event_type"] : "subscription.updated";
  return billingEventFromType(type, new Date(seconds * 1000).toISOString());
}
