# `stock-chart-worker`

Cloudflare worker for stock timeseries data.

## Prerequisites

- Cloudflare account
- [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler)
- [pnpm](https://pnpm.io)
- One of the following data providers
  - [Finacial Modelling Prep](https://site.financialmodelingprep.com/developer/docs)
  - [Alpha Vantage](https://www.alphavantage.co)

## Get started

1. Install dependencies: `pnpm`
2. Set Cloudflare account ID: `wrangler secret put CF_ACCOUNT_ID`
3. Set Cloudflare zone ID: `wrangler secret put CF_ZONE_ID`
4. Create Cloudflare Worker KV: `wrangler kv:namespace create "STOCK_CHART_KV"`
5. Set one of the following data provider keys:

- Financial Modelling Prep API key: `wrangler secret put FMP_API_KEY`
- Alpha Vantage API key: `wrangler secret put AV_API_KEY`

6. Run in dev machine: `wrangler dev`
7. Deploy to Cloudflare: `wrangler publish`
