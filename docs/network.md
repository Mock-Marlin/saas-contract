# Network

Every JSON error from the server includes `requestId`. The matching response header is `x-request-id`. Clients send that header when they already have an id. Otherwise the server creates one.

`x-saas-server-build` is optional. The client remembers the first value and calls `onStaleClient` when a later response carries a different build.

`idempotency-key` travels on billing, upload, and operation posts. The server passes the key to the app port. The plugin does not store the first result.
