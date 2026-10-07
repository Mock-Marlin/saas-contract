/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import { ContractParseError, isRecord } from "./guard.js";

export interface UploadGrant {
  url: string;
  method: string;
  headers: Record<string, string>;
  key: string;
}

export interface UploadResult {
  key: string;
  sizeBytes: number;
  mimeType: string;
  fileName?: string;
}

export function parseUploadGrant(value: unknown): UploadGrant {
  if (
    !isRecord(value) ||
    typeof value["url"] !== "string" ||
    value["url"].length === 0 ||
    typeof value["method"] !== "string" ||
    value["method"].length === 0 ||
    typeof value["key"] !== "string" ||
    value["key"].length === 0 ||
    !isRecord(value["headers"])
  ) {
    throw new ContractParseError("Upload grant does not match the contract");
  }
  const headers: Record<string, string> = {};
  for (const [name, header] of Object.entries(value["headers"])) {
    if (typeof header !== "string") {
      throw new ContractParseError("Upload grant headers must be strings");
    }
    headers[name] = header;
  }
  return { url: value["url"], method: value["method"], headers, key: value["key"] };
}

export function parseUploadResult(value: unknown): UploadResult {
  if (
    !isRecord(value) ||
    typeof value["key"] !== "string" ||
    value["key"].length === 0 ||
    typeof value["sizeBytes"] !== "number" ||
    !Number.isInteger(value["sizeBytes"]) ||
    value["sizeBytes"] < 1 ||
    typeof value["mimeType"] !== "string" ||
    value["mimeType"].length === 0
  ) {
    throw new ContractParseError("Upload result does not match the contract");
  }
  const result: UploadResult = {
    key: value["key"],
    sizeBytes: value["sizeBytes"],
    mimeType: value["mimeType"],
  };
  if (typeof value["fileName"] === "string" && value["fileName"].length > 0) {
    result.fileName = value["fileName"];
  }
  return result;
}
