/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import { ContractParseError, isRecord } from "./guard.js";

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

export function parseCursorPage<T>(value: unknown, parseItem: (item: unknown) => T): CursorPage<T> {
  if (!isRecord(value) || !Array.isArray(value["items"])) {
    throw new ContractParseError("Page is missing items");
  }
  const nextCursor = value["nextCursor"];
  if (nextCursor !== null && typeof nextCursor !== "string") {
    throw new ContractParseError("Page nextCursor must be a string or null");
  }
  return {
    items: value["items"].map((item) => parseItem(item)),
    nextCursor,
  };
}
