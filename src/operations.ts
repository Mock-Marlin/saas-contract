/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import { parseErrorEnvelope, type ErrorEnvelope } from "./error.js";
import { ContractParseError, isRecord } from "./guard.js";

export const OPERATION_STATUSES = ["queued", "running", "succeeded", "failed"] as const;
export type OperationStatus = (typeof OPERATION_STATUSES)[number];

export interface Operation {
  id: string;
  status: OperationStatus;
  pollAfterMs: number;
  result?: unknown;
  error?: ErrorEnvelope;
}

export function parseOperation(value: unknown): Operation {
  if (
    !isRecord(value) ||
    typeof value["id"] !== "string" ||
    value["id"].length === 0 ||
    (value["status"] !== "queued" && value["status"] !== "running" && value["status"] !== "succeeded" && value["status"] !== "failed") ||
    typeof value["pollAfterMs"] !== "number" ||
    !Number.isInteger(value["pollAfterMs"]) ||
    value["pollAfterMs"] < 0
  ) {
    throw new ContractParseError("Operation does not match the contract");
  }
  const operation: Operation = {
    id: value["id"],
    status: value["status"],
    pollAfterMs: value["pollAfterMs"],
  };
  if (Object.hasOwn(value, "result")) {
    operation.result = value["result"];
  }
  if (value["error"] !== undefined) {
    operation.error = parseErrorEnvelope(value["error"]);
  }
  return operation;
}
