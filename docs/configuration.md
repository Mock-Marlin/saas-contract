# Configuration

`createPaths(basePath, overrides)` is the only configuration in this package. `basePath` is required and must start with `/`. Overrides replace individual relative paths. Omitted paths keep the defaults below.

- Session: `/session`
- Billing snapshot: `/billing`
- Billing checkout, portal, cancel, resume, keep, sync: `/billing/checkout`, `/billing/portal`, `/billing/cancel`, `/billing/resume`, `/billing/keep`, `/billing/sync`
- Billing webhook: `/billing/webhooks/:merchant`
- Notifications: `/notifications`, `/notifications/stream`, `/notifications/:id/seen`, `/notifications/:id`
- Account sessions: `/sessions`, `/sessions/:id/revoke`
- Uploads: `/uploads`, `/uploads/complete`
- Operations: `/operations`, `/operations/:id`

`joinPath` concatenates the prefix and a relative path. `fillPath` replaces `:id` and `:merchant`.

JSON bodies do not include the URL version. Breaking changes to these objects follow the package major version.
