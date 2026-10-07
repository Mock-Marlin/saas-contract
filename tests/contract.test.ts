/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from "vitest";

import {
  ContractParseError,
  createPaths,
  fillPath,
  joinPath,
  parseAccountSession,
  parseBillingSnapshot,
  parseCheckoutResult,
  parseCursorPage,
  parseErrorEnvelope,
  parseNotificationItem,
  parseOperation,
  parseUploadGrant,
  parseUploadResult,
} from "../src/index.js";

const snapshot = {
  planId: "pro",
  renewsAt: null,
  cancelAtPeriodEnd: false,
  paymentState: "ok",
  checkoutState: "none",
  entitlements: { seats: true },
  usage: [{ key: "requests", used: 1, limit: 10 }],
};

describe("parsers", () => {
  it("reads an error envelope", () => {
    expect(parseErrorEnvelope({ status: 401, code: "unauthorized", message: "Sign in", requestId: "req_1" })).toEqual({
      status: 401,
      code: "unauthorized",
      message: "Sign in",
      requestId: "req_1",
    });
  });

  it("rejects a short error envelope", () => {
    expect(() => parseErrorEnvelope({ status: 400 })).toThrow(ContractParseError);
  });

  it("reads a cursor page", () => {
    expect(parseCursorPage({ items: ["a"], nextCursor: null }, (item) => item)).toEqual({
      items: ["a"],
      nextCursor: null,
    });
  });

  it("reads a billing snapshot and checkout results", () => {
    expect(parseBillingSnapshot(snapshot).planId).toBe("pro");
    expect(parseCheckoutResult({ status: "pending" })).toEqual({ status: "pending" });
    expect(parseCheckoutResult({ status: "redirect", url: "https://checkout.example" }).status).toBe("redirect");
    expect(parseCheckoutResult({ status: "embedded", clientSecret: "sec" }).status).toBe("embedded");
  });

  it("rejects a billing snapshot with a bad entitlement", () => {
    expect(() => parseBillingSnapshot({ ...snapshot, entitlements: { seats: "yes" } })).toThrow(ContractParseError);
  });

  it("reads a notification, session, upload, and operation", () => {
    expect(
      parseNotificationItem({ id: "n1", createdAt: "2026-01-01T00:00:00.000Z", seenAt: null, type: "notice", payload: { ok: true } }).id,
    ).toBe("n1");
    expect(
      parseAccountSession({
        id: "s1",
        userAgent: null,
        ip: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        current: true,
      }).current,
    ).toBe(true);
    expect(parseUploadGrant({ url: "https://files.example", method: "PUT", headers: { "content-type": "text/plain" }, key: "k" }).key).toBe("k");
    expect(parseUploadResult({ key: "k", sizeBytes: 4, mimeType: "text/plain", fileName: "a.txt" }).fileName).toBe("a.txt");
    expect(parseOperation({ id: "op", status: "queued", pollAfterMs: 1000 }).status).toBe("queued");
  });
});

describe("paths", () => {
  it("joins the parent base path and fills parameters", () => {
    const paths = createPaths("/api/v1", { billing: { webhookPath: "/billing/webhook" } });
    expect(paths.basePath).toBe("/api/v1");
    expect(paths.billing.webhookPath).toBe("/billing/webhook");
    expect(paths.billing.snapshotPath).toBe("/billing");
    expect(joinPath(paths.basePath, paths.notifications.streamPath)).toBe("/api/v1/notifications/stream");
    expect(fillPath(paths.sessions.revokePath, { id: "a/b" })).toBe("/sessions/a%2Fb/revoke");
  });

  it("rejects a base path that is not rooted", () => {
    expect(() => createPaths("v1")).toThrow(TypeError);
  });
});
