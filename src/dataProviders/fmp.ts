import { roundTo, parseDate } from '../util'

declare const FMP_API_KEY: string
const FMP_API_URL = 'https://financialmodelingprep.com/api/v3'

interface HistoricalPrice {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface HistoricalPriceWithAdjClose extends HistoricalPrice {
  adjClose: number
}

const getDailyData = async (symbol: string) => {
  const url = `${FMP_API_URL}/historical-price-full/${symbol}?timeseries=20000&apikey=${FMP_API_KEY}`

  const response = await fetch(url)

  const data = await response.json()
  const timeSeries = data.historical as HistoricalPriceWithAdjClose[]

  return timeSeries
    .map((d) => ({ ...d, date: parseDate(d.date) }))
    .map((d) => {
      const close = roundTo(d.close)
      const ratio = roundTo(d.adjClose / close)

      return [
        roundTo(d.open * ratio),
        roundTo(d.high * ratio),
        roundTo(d.low * ratio),
        close * ratio,
        roundTo(d.volume),
        d.date.getTime(),
      ]
    })
    .reverse()
}

const getHourlyData = async (symbol: string) => {
  const url = `${FMP_API_URL}/historical-chart/1hour/${symbol}?apikey=${FMP_API_KEY}`

  const response = await fetch(url)

  const timeSeries = (await response.json()) as HistoricalPrice[]

  return timeSeries
    .map((d) => ({ ...d, date: parseDate(d.date) }))
    .map((d) => [
      roundTo(d.open),
      roundTo(d.high),
      roundTo(d.low),
      roundTo(d.close),
      roundTo(d.volume),
      d.date.getTime(),
    ])
    .reverse()
}

export { getDailyData, getHourlyData }
