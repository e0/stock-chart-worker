import { roundTo, secondsUntilNextWeekday } from './util'

declare const STOCK_CHART_KV: KVNamespace
declare const AV_API_KEY: string

const loadTimeSeries = async (symbol: string, full?: boolean) => {
  const cached = await STOCK_CHART_KV.get(symbol)

  if (cached) {
    return JSON.parse(cached)
  }

  let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${AV_API_KEY}`
  if (full) {
    url = `${url}&outputsize=full`
  }

  const response = await fetch(url)
  const data = await response.json()
  const timeSeriesData = data['Time Series (Daily)']

  const chartData = Object.keys(timeSeriesData)
    .map((d) => ({ ...timeSeriesData[d], date: new Date(d) }))
    .reverse()

  const series = []

  // 1. loop through the daily timeseries
  // 2. reformat data
  for (let d of chartData) {
    const close = roundTo(parseFloat(d['4. close']))
    const ratio = roundTo(parseFloat(d['5. adjusted close']) / close)

    const o = roundTo(parseFloat(d['1. open']) * ratio)
    const h = roundTo(parseFloat(d['2. high']) * ratio)
    const l = roundTo(parseFloat(d['3. low']) * ratio)
    const c = close * ratio
    const v = roundTo(parseFloat(d['6. volume']))
    const t = d.date.getTime()

    const dailyData = [o, h, l, c, v, t]
    series.push(dailyData)
  }

  await STOCK_CHART_KV.put(symbol, JSON.stringify(series), {
    expirationTtl: secondsUntilNextWeekday(),
  })

  return series
}

export { loadTimeSeries }
