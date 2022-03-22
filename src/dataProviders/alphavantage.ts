import { parseDate } from '../util'

declare const AV_API_KEY: string
const AV_API_URL = `https://www.alphavantage.co/query?apikey=${AV_API_KEY}`

const getChartData = async (symbol: string, interval: 'daily' | 'hourly') => {
  const endpointFunction =
    interval === 'daily' ? 'TIME_SERIES_DAILY_ADJUSTED' : 'TIME_SERIES_INTRADAY'
  const intervalParam = interval === 'daily' ? '' : '&interval=60min'
  const url = `${AV_API_URL}&function=${endpointFunction}&symbol=${symbol}${intervalParam}&outputsize=full`

  const response = await fetch(url)

  const data = await response.json()
  const timeZone =
    data['Meta Data'][`${interval === 'daily' ? '5' : '6'}. Time Zone`]
  const timeSeries =
    data[`Time Series (${interval === 'daily' ? 'Daily' : '60min'})`]

  return Object.keys(timeSeries)
    .map((d) => ({ ...timeSeries[d], date: parseDate(d, timeZone) }))
    .reverse()
}

export { getChartData }
