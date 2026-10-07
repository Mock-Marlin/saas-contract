# @mockmarlin/saas-contract

[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Mock-Marlin/saas-contract)](https://github.com/Mock-Marlin/saas-contract)

JSON shapes for a SaaS API. The Fastify plugin and the React kit both import this package, so a billing snapshot on the server is the same value the browser parses.

The parent app chooses the URL prefix. This package has no `/api/v1` default. `createPaths("/api/v2")` joins that prefix to relative service paths.

Requires Node.js 24 or newer.

## Install

```bash
npm install @mockmarlin/saas-contract
```

## Minimal use

```ts
import { createPaths, joinPath, parseBillingSnapshot } from "@mockmarlin/saas-contract";

const paths = createPaths("/api/v1");
const url = joinPath(paths.basePath, paths.billing.snapshotPath);
const snapshot = parseBillingSnapshot(await response.json());
```

Merchant signature checks live on subpath exports so the root import stays limited to JSON shapes.

```ts
import { verifyDodoWebhook, allowDodoRedirect } from "@mockmarlin/saas-contract/merchants/dodo";
```

## What to read next

| Guide | What it covers |
|---|---|
| [docs/setup.md](docs/setup.md) | Install and the first parsed payload |
| [docs/configuration.md](docs/configuration.md) | Path defaults and how an app overrides them |
| [docs/api.md](docs/api.md) | Each export |
| [docs/billing.md](docs/billing.md) | Snapshot, checkout, and merchant signatures |
| [docs/notifications.md](docs/notifications.md) | Notification items and server-sent event names |
| [docs/network.md](docs/network.md) | Request id, server build, and idempotency headers |

## Contributing

Issues and pull requests: [github.com/Mock-Marlin/saas-contract](https://github.com/Mock-Marlin/saas-contract).

Use Node.js 24 or newer.

```bash
npm test
npm run lint
npm run build
```

`npm test` runs Vitest. `npm run lint` typechecks the source and the tests. `npm run build` emits `dist/` with declarations.

## License

[MIT](LICENSE) © 2026 MockMarlin
