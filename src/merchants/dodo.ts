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
  signBase64,
} from "./sign.js";

export { allowDodoRedirect } from "./redirects.js";

function secretBytes(secret: string): Buffer {
  const encoded = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret;
  return Buffer.from(encoded, "base64");
}

export function verifyDodoWebhook(
  rawBody: Buffer,
  headers: Record<string, string | string[] | undefined>,
  secret: string,
  nowMs = Date.now(),
): BillingEvent {
  const mapped = headerMap(headers);
  const id = mapped["webhook-id"];
  const timestamp = mapped["webhook-timestamp"];
  const signature = mapped["webhook-signature"];
  if (id === undefined || timestamp === undefined || signature === undefined) {
    throw new WebhookVerificationError("Dodo webhook is missing signature headers");
  }
  const seconds = Number(timestamp);
  assertFreshTimestamp(seconds, nowMs);
  const expected = signBase64(secretBytes(secret), `${id}.${timestamp}.${rawBody.toString("utf8")}`);
  const match = signature.split(" ").some((part) => {
    const [, value] = part.split(",", 2);
    return value !== undefined && secureEqual(value, expected);
  });
  if (!match) {
    throw new WebhookVerificationError("Dodo webhook signature does not match");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody.toString("utf8"));
  } catch {
    throw new WebhookVerificationError("Dodo webhook body is not JSON");
  }
  const type = isRecord(parsed) && typeof parsed["type"] === "string" ? parsed["type"] : "subscription.updated";
  return billingEventFromType(type, new Date(seconds * 1000).toISOString());
}
