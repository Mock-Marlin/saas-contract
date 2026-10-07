# Setup

This package has no server and no React tree. Install it next to `@mockmarlin/saas-server` or `@mockmarlin/saas-kit`, or on its own when you only need the parsers.

## Requirements

- Node.js 24 or newer

```bash
npm install @mockmarlin/saas-contract
```

Pass the same `basePath` the parent app already uses for the rest of its API. `createPaths` stores that prefix and fills every service path the server and the client share.
