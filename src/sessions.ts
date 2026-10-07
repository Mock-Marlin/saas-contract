/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import { ContractParseError, isRecord } from "./guard.js";

export interface AccountSession {
  id: string;
  userAgent: string | null;
  ip: string | null;
  createdAt: string;
  current: boolean;
}

export function parseAccountSession(value: unknown): AccountSession {
  if (
    !isRecord(value) ||
    typeof value["id"] !== "string" ||
    value["id"].length === 0 ||
    (value["userAgent"] !== null && typeof value["userAgent"] !== "string") ||
    (value["ip"] !== null && typeof value["ip"] !== "string") ||
    typeof value["createdAt"] !== "string" ||
    value["createdAt"].length === 0 ||
    typeof value["current"] !== "boolean"
  ) {
    throw new ContractParseError("Account session does not match the contract");
  }
  return {
    id: value["id"],
    userAgent: value["userAgent"],
    ip: value["ip"],
    createdAt: value["createdAt"],
    current: value["current"],
  };
}
