# API

## Parsers

Each parser throws `ContractParseError` when the JSON does not match.

| Export | Returns |
|---|---|
| `parseErrorEnvelope` | `{ status, code, message, requestId }` |
| `parseCursorPage` | `{ items, nextCursor }` using the item parser you pass |
| `parseBillingSnapshot` | Plan, renewal, payment state, checkout state, entitlements, usage |
| `parseCheckoutResult` | `redirect`, `pending`, or `embedded` |
| `parseBillingEvent` | `checkout.updated`, `subscription.updated`, or `payment.failed` |
| `parseNotificationItem` | `id`, `createdAt`, `seenAt`, `type`, `payload` |
| `parseAccountSession` | Device row |
| `parseUploadGrant` | URL, method, headers, key |
| `parseUploadResult` | Key, size, media type, optional file name |
| `parseOperation` | Job id, status, `pollAfterMs`, optional result and error |

`SaasError` is the error the React kit throws after reading an envelope.

## Paths

`createPaths`, `joinPath`, `fillPath`, and `normalizeBasePath`. Default path constants use `CONSTANT_CASE` names such as `DEFAULT_BILLING_SNAPSHOT_PATH`.

## Headers

`REQUEST_ID_HEADER` is `x-request-id`. `SERVER_BUILD_HEADER` is `x-saas-server-build`. `IDEMPOTENCY_KEY_HEADER` is `idempotency-key`.

## Merchants

Imported from `@mockmarlin/saas-contract/merchants/dodo`, `stripe`, or `paddle`.

| Export | Behavior |
|---|---|
| `allowDodoRedirect` / `allowStripeRedirect` / `allowPaddleRedirect` | HTTPS URL whose host is the merchant or a subdomain |
| `verifyDodoWebhook` | Standard Webhooks HMAC. Secret may start with `whsec_`. |
| `verifyStripeWebhook` | `Stripe-Signature` HMAC over `timestamp.body` |
| `verifyPaddleWebhook` | `Paddle-Signature` HMAC over `timestamp:body` |

Verification throws `WebhookVerificationError`. Timestamps more than five minutes from `nowMs` are rejected.
