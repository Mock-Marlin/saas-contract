/**
 * Copyright (c) 2026 MockMarlin
 *
 * SPDX-License-Identifier: MIT
 */

import { allowHttpsHost } from "./hosts.js";

export function allowDodoRedirect(url: string): boolean {
  return allowHttpsHost(url, ["dodopayments.com"]);
}

export function allowStripeRedirect(url: string): boolean {
  return allowHttpsHost(url, ["stripe.com"]);
}

export function allowPaddleRedirect(url: string): boolean {
  return allowHttpsHost(url, ["paddle.com"]);
}
