/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

export const REQUEST_ID_HEADER = "x-request-id";
export const SERVER_BUILD_HEADER = "x-saas-server-build";
export const IDEMPOTENCY_KEY_HEADER = "idempotency-key";

export interface SessionUser {
  id: string;
}
