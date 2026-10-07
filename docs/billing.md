# Billing

A snapshot is the current subscription, not a vendor payload.

`planId` is the app's own plan name. `paymentState` is `ok`, `needs_payment_method`, or `failed`. `checkoutState` is `none`, `processing`, `succeeded`, `declined`, `cancelled`, or `incomplete`. `entitlements` is a map of feature name to boolean. `usage` is `{ key, used, limit }`.

Checkout results:

- `redirect` carries an HTTPS URL. The client checks it with the merchant allowlist before navigating.
- `pending` means the bank has not finished.
- `embedded` carries a client secret for a merchant element the app mounts itself.

Webhook adapters return a `BillingEvent`: `checkout.updated`, `subscription.updated`, or `payment.failed`, plus `occurredAt`. The vendor JSON does not leave the adapter.
