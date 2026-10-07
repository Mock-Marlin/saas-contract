/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

export class ContractParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContractParseError";
  }
}

export class SaasError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId: string;

  constructor(status: number, code: string, message: string, requestId: string) {
    super(message);
    this.name = "SaasError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function headerValue(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === "string" && value[0].length > 0) {
    return value[0];
  }
  return undefined;
}
