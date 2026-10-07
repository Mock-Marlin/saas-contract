/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import { ContractParseError, isRecord } from "./guard.js";

export interface ErrorEnvelope {
  status: number;
  code: string;
  message: string;
  requestId: string;
}

export function parseErrorEnvelope(value: unknown): ErrorEnvelope {
  if (
    !isRecord(value) ||
    typeof value["status"] !== "number" ||
    !Number.isInteger(value["status"]) ||
    typeof value["code"] !== "string" ||
    value["code"].length === 0 ||
    typeof value["message"] !== "string" ||
    value["message"].length === 0 ||
    typeof value["requestId"] !== "string" ||
    value["requestId"].length === 0
  ) {
    throw new ContractParseError("Error envelope is missing status, code, message, or requestId");
  }
  return {
    status: value["status"],
    code: value["code"],
    message: value["message"],
    requestId: value["requestId"],
  };
}
