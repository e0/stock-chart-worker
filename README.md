# `stock-chart-worker`

Cloudflare worker for generating stock chart images.

## Prerequisites

- Cloudflare account
- [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler)
- [yarn](https://yarnpkg.com)

## Get started

1. `yarn`
2. `wrangler secret put CF_ACCOUNT_ID`
3. `wrangler secret put CF_ZONE_ID`
4. `wrangler dev` to run in dev machine or `wrangler publish` to deploy to Cloudflare
