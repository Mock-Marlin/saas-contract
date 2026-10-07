/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";

import { allowDodoRedirect, verifyDodoWebhook } from "../src/merchants/dodo.js";
import { allowPaddleRedirect, verifyPaddleWebhook } from "../src/merchants/paddle.js";
import { allowStripeRedirect, verifyStripeWebhook } from "../src/merchants/stripe.js";
import { WebhookVerificationError } from "../src/merchants/sign.js";

const nowMs = Date.parse("2026-10-08T00:00:00.000Z");
const seconds = String(Math.floor(nowMs / 1000));

describe("merchant adapters", () => {
  it("allowlists merchant redirect hosts", () => {
    expect(allowDodoRedirect("https://checkout.dodopayments.com/pay")).toBe(true);
    expect(allowDodoRedirect("http://dodopayments.com/pay")).toBe(false);
    expect(allowStripeRedirect("https://checkout.stripe.com/c/pay_1")).toBe(true);
    expect(allowStripeRedirect("https://evil.com")).toBe(false);
    expect(allowPaddleRedirect("https://buy.paddle.com/checkout")).toBe(true);
  });

  it("verifies a Dodo standard webhook", () => {
    const secret = `whsec_${Buffer.from("dodo-secret").toString("base64")}`;
    const body = Buffer.from(JSON.stringify({ type: "payment.failed" }));
    const signed = `msg_1.${seconds}.${body.toString("utf8")}`;
    const digest = createHmac("sha256", Buffer.from("dodo-secret")).update(signed).digest("base64");
    const event = verifyDodoWebhook(body, { "webhook-id": "msg_1", "webhook-timestamp": seconds, "webhook-signature": `v1,${digest}` }, secret, nowMs);
    expect(event.name).toBe("payment.failed");
  });

  it("rejects a Stripe signature that does not match", () => {
    const body = Buffer.from(JSON.stringify({ type: "checkout.session.completed" }));
    expect(() => verifyStripeWebhook(body, { "stripe-signature": `t=${seconds},v1=deadbeef` }, "whsec_test", nowMs)).toThrow(WebhookVerificationError);
  });

  it("verifies a Paddle signature", () => {
    const secret = "paddle-secret";
    const body = Buffer.from(JSON.stringify({ event_type: "subscription.updated" }));
    const digest = createHmac("sha256", secret).update(`${seconds}:${body.toString("utf8")}`).digest("hex");
    const event = verifyPaddleWebhook(body, { "paddle-signature": `ts=${seconds};h1=${digest}` }, secret, nowMs);
    expect(event.name).toBe("subscription.updated");
  });
});
