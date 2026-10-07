/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import { ContractParseError, isRecord } from "./guard.js";

export const NOTIFICATION_CREATED_EVENT = "notification";
export const NOTIFICATION_REMOVED_EVENT = "notification.removed";

export interface NotificationItem {
  id: string;
  createdAt: string;
  seenAt: string | null;
  type: string;
  payload: unknown;
}

export function parseNotificationItem(value: unknown): NotificationItem {
  if (
    !isRecord(value) ||
    typeof value["id"] !== "string" ||
    value["id"].length === 0 ||
    typeof value["createdAt"] !== "string" ||
    value["createdAt"].length === 0 ||
    (value["seenAt"] !== null && typeof value["seenAt"] !== "string") ||
    typeof value["type"] !== "string" ||
    value["type"].length === 0 ||
    !Object.hasOwn(value, "payload")
  ) {
    throw new ContractParseError("Notification item does not match the contract");
  }
  return {
    id: value["id"],
    createdAt: value["createdAt"],
    seenAt: value["seenAt"],
    type: value["type"],
    payload: value["payload"],
  };
}
