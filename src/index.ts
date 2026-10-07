/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

export { parseBillingEvent, parseBillingSnapshot, parseCheckoutResult } from "./billing.js";
export type {
  BillingEvent,
  BillingEventName,
  BillingSnapshot,
  CheckoutResult,
  CheckoutState,
  PaymentState,
  UsageMeter,
} from "./billing.js";
export { CHECKOUT_STATES, PAYMENT_STATES, BILLING_EVENT_NAMES } from "./billing.js";
export { parseErrorEnvelope } from "./error.js";
export type { ErrorEnvelope } from "./error.js";
export { ContractParseError, SaasError, headerValue, isRecord } from "./guard.js";
export { IDEMPOTENCY_KEY_HEADER, REQUEST_ID_HEADER, SERVER_BUILD_HEADER } from "./headers.js";
export type { SessionUser } from "./headers.js";
export { NOTIFICATION_CREATED_EVENT, NOTIFICATION_REMOVED_EVENT, parseNotificationItem } from "./notifications.js";
export type { NotificationItem } from "./notifications.js";
export { parseOperation } from "./operations.js";
export type { Operation, OperationStatus } from "./operations.js";
export { OPERATION_STATUSES } from "./operations.js";
export { parseCursorPage } from "./page.js";
export type { CursorPage } from "./page.js";
export {
  createPaths,
  fillPath,
  joinPath,
  normalizeBasePath,
  DEFAULT_ACCOUNT_SESSION_LIST_PATH,
  DEFAULT_ACCOUNT_SESSION_REVOKE_PATH,
  DEFAULT_BILLING_CANCEL_PATH,
  DEFAULT_BILLING_CHECKOUT_PATH,
  DEFAULT_BILLING_KEEP_PATH,
  DEFAULT_BILLING_PORTAL_PATH,
  DEFAULT_BILLING_RESUME_PATH,
  DEFAULT_BILLING_SNAPSHOT_PATH,
  DEFAULT_BILLING_SYNC_PATH,
  DEFAULT_BILLING_WEBHOOK_PATH,
  DEFAULT_NOTIFICATION_DELETE_PATH,
  DEFAULT_NOTIFICATION_LIST_PATH,
  DEFAULT_NOTIFICATION_SEEN_PATH,
  DEFAULT_NOTIFICATION_STREAM_PATH,
  DEFAULT_OPERATION_CREATE_PATH,
  DEFAULT_OPERATION_ITEM_PATH,
  DEFAULT_SESSION_PATH,
  DEFAULT_UPLOAD_COMPLETE_PATH,
  DEFAULT_UPLOAD_PREPARE_PATH,
} from "./paths.js";
export type {
  AccountSessionPaths,
  BillingPaths,
  NotificationPaths,
  OperationPaths,
  SaasPathOverrides,
  SaasPaths,
  UploadPaths,
} from "./paths.js";
export { parseAccountSession } from "./sessions.js";
export type { AccountSession } from "./sessions.js";
export { parseUploadGrant, parseUploadResult } from "./uploads.js";
export type { UploadGrant, UploadResult } from "./uploads.js";
