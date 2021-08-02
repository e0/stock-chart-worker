import { roundTo, secondsUntilNextWeekday, formatNumber } from './util'

declare const STOCK_CHART_KV: KVNamespace
declare const AV_API_KEY: string

// const dailyData = [o, h, l, c, v, t]
const calculateAdrPct = (series: any) => {
  const candles = series.slice(series.length - 20, series.length)
  const adr =
    candles.reduce((total: number, d: any) => total + d[1] / d[2], 0) / 20 - 1
  return parseFloat((100 * adr).toFixed(2))
}

const calculateDollarVol = (series: any) => {
  const candles = series.slice(series.length - 5, series.length)
  const dollar = candles.reduce((total: number, d: any) => total + d[3], 0)
  const vol = candles.reduce((total: number, d: any) => total + d[4], 0)
  const dollarVol = (dollar * vol) / 5
  return formatNumber(dollarVol)
}

const loadChartData = async (symbol: string, full?: boolean) => {
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
  const timeSeriesDaily = data['Time Series (Daily)']

  const seriesDaily = Object.keys(timeSeriesDaily)
    .map((d) => ({ ...timeSeriesDaily[d], date: new Date(d) }))
    .reverse()

  const formattedSeriesDaily = []

  // 1. loop through the daily timeseries
  // 2. reformat data
  for (let d of seriesDaily) {
    const close = roundTo(parseFloat(d['4. close']))
    const ratio = roundTo(parseFloat(d['5. adjusted close']) / close)

    const o = roundTo(parseFloat(d['1. open']) * ratio)
    const h = roundTo(parseFloat(d['2. high']) * ratio)
    const l = roundTo(parseFloat(d['3. low']) * ratio)
    const c = close * ratio
    const v = roundTo(parseFloat(d['6. volume']))
    const t = d.date.getTime()

    const dailyData = [o, h, l, c, v, t]
    formattedSeriesDaily.push(dailyData)
  }

  const chartData = {
    timeseries: formattedSeriesDaily,
    adrPct: calculateAdrPct(formattedSeriesDaily),
    dollarVol: calculateDollarVol(formattedSeriesDaily),
  }

  await STOCK_CHART_KV.put(symbol, JSON.stringify(chartData), {
    expirationTtl: secondsUntilNextWeekday(),
  })

  return chartData
}

export { loadChartData }