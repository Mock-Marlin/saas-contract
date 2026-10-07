/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

export const DEFAULT_SESSION_PATH = "/session";
export const DEFAULT_BILLING_SNAPSHOT_PATH = "/billing";
export const DEFAULT_BILLING_CHECKOUT_PATH = "/billing/checkout";
export const DEFAULT_BILLING_PORTAL_PATH = "/billing/portal";
export const DEFAULT_BILLING_CANCEL_PATH = "/billing/cancel";
export const DEFAULT_BILLING_RESUME_PATH = "/billing/resume";
export const DEFAULT_BILLING_KEEP_PATH = "/billing/keep";
export const DEFAULT_BILLING_SYNC_PATH = "/billing/sync";
export const DEFAULT_BILLING_WEBHOOK_PATH = "/billing/webhooks/:merchant";
export const DEFAULT_NOTIFICATION_LIST_PATH = "/notifications";
export const DEFAULT_NOTIFICATION_STREAM_PATH = "/notifications/stream";
export const DEFAULT_NOTIFICATION_SEEN_PATH = "/notifications/:id/seen";
export const DEFAULT_NOTIFICATION_DELETE_PATH = "/notifications/:id";
export const DEFAULT_ACCOUNT_SESSION_LIST_PATH = "/sessions";
export const DEFAULT_ACCOUNT_SESSION_REVOKE_PATH = "/sessions/:id/revoke";
export const DEFAULT_UPLOAD_PREPARE_PATH = "/uploads";
export const DEFAULT_UPLOAD_COMPLETE_PATH = "/uploads/complete";
export const DEFAULT_OPERATION_CREATE_PATH = "/operations";
export const DEFAULT_OPERATION_ITEM_PATH = "/operations/:id";

export interface BillingPaths {
  snapshotPath: string;
  checkoutPath: string;
  portalPath: string;
  cancelPath: string;
  resumePath: string;
  keepPath: string;
  syncPath: string;
  webhookPath: string;
}

export interface NotificationPaths {
  listPath: string;
  streamPath: string;
  seenPath: string;
  deletePath: string;
}

export interface AccountSessionPaths {
  listPath: string;
  revokePath: string;
}

export interface UploadPaths {
  preparePath: string;
  completePath: string;
}

export interface OperationPaths {
  createPath: string;
  itemPath: string;
}

export interface SaasPaths {
  basePath: string;
  session: { path: string };
  billing: BillingPaths;
  notifications: NotificationPaths;
  sessions: AccountSessionPaths;
  uploads: UploadPaths;
  operations: OperationPaths;
}

export function normalizeBasePath(basePath: string): string {
  const trimmed = basePath.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    throw new TypeError("basePath must start with a single /");
  }
  if (trimmed.length > 1 && trimmed.endsWith("/")) {
    return trimmed.replace(/\/+$/, "");
  }
  return trimmed;
}

export function joinPath(basePath: string, path: string): string {
  const base = normalizeBasePath(basePath);
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new TypeError("Service path must start with a single /");
  }
  if (base === "/") {
    return path;
  }
  return `${base}${path}`;
}

export function fillPath(path: string, params: Record<string, string>): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, (_match, name: string) => {
    const value = params[name];
    if (value === undefined || value.length === 0) {
      throw new TypeError(`Missing path parameter ${name}`);
    }
    return encodeURIComponent(value);
  });
}

export interface SaasPathOverrides {
  session?: { path?: string };
  billing?: Partial<BillingPaths>;
  notifications?: Partial<NotificationPaths>;
  sessions?: Partial<AccountSessionPaths>;
  uploads?: Partial<UploadPaths>;
  operations?: Partial<OperationPaths>;
}

export function createPaths(basePath: string, overrides: SaasPathOverrides = {}): SaasPaths {
  return {
    basePath: normalizeBasePath(basePath),
    session: { path: overrides.session?.path ?? DEFAULT_SESSION_PATH },
    billing: {
      snapshotPath: overrides.billing?.snapshotPath ?? DEFAULT_BILLING_SNAPSHOT_PATH,
      checkoutPath: overrides.billing?.checkoutPath ?? DEFAULT_BILLING_CHECKOUT_PATH,
      portalPath: overrides.billing?.portalPath ?? DEFAULT_BILLING_PORTAL_PATH,
      cancelPath: overrides.billing?.cancelPath ?? DEFAULT_BILLING_CANCEL_PATH,
      resumePath: overrides.billing?.resumePath ?? DEFAULT_BILLING_RESUME_PATH,
      keepPath: overrides.billing?.keepPath ?? DEFAULT_BILLING_KEEP_PATH,
      syncPath: overrides.billing?.syncPath ?? DEFAULT_BILLING_SYNC_PATH,
      webhookPath: overrides.billing?.webhookPath ?? DEFAULT_BILLING_WEBHOOK_PATH,
    },
    notifications: {
      listPath: overrides.notifications?.listPath ?? DEFAULT_NOTIFICATION_LIST_PATH,
      streamPath: overrides.notifications?.streamPath ?? DEFAULT_NOTIFICATION_STREAM_PATH,
      seenPath: overrides.notifications?.seenPath ?? DEFAULT_NOTIFICATION_SEEN_PATH,
      deletePath: overrides.notifications?.deletePath ?? DEFAULT_NOTIFICATION_DELETE_PATH,
    },
    sessions: {
      listPath: overrides.sessions?.listPath ?? DEFAULT_ACCOUNT_SESSION_LIST_PATH,
      revokePath: overrides.sessions?.revokePath ?? DEFAULT_ACCOUNT_SESSION_REVOKE_PATH,
    },
    uploads: {
      preparePath: overrides.uploads?.preparePath ?? DEFAULT_UPLOAD_PREPARE_PATH,
      completePath: overrides.uploads?.completePath ?? DEFAULT_UPLOAD_COMPLETE_PATH,
    },
    operations: {
      createPath: overrides.operations?.createPath ?? DEFAULT_OPERATION_CREATE_PATH,
      itemPath: overrides.operations?.itemPath ?? DEFAULT_OPERATION_ITEM_PATH,
    },
  };
}
