# `stock-chart-worker`

Cloudflare worker for stock timeseries data.

## Prerequisites

- Cloudflare account
- [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler)
- [yarn](https://yarnpkg.com)
- [Alpha Vantage](https://www.alphavantage.co)

## Get started

1. Install dependencies: `yarn`
2. Set Cloudflare account ID: `wrangler secret put CF_ACCOUNT_ID`
3. Set Cloudflare zone ID: `wrangler secret put CF_ZONE_ID`
4. Create Cloudflare Worker KV: `wrangler kv:namespace create "STOCK_CHART_KV"`
5. Set Alpha Vantage API key: `wrangler secret put AV_API_KEY`
6. Run in dev machine: `wrangler dev`
7. Deploy to Cloudflare: `wrangler publish`
