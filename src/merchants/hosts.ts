/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

export function allowHttpsHost(url: string, hosts: readonly string[]): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return (
      parsed.protocol === "https:" &&
      parsed.username.length === 0 &&
      parsed.password.length === 0 &&
      hosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))
    );
  } catch {
    return false;
  }
}
