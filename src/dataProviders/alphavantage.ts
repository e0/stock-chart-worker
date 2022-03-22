import { roundTo, parseDate } from '../util'

declare const AV_API_KEY: string
const AV_API_URL = `https://www.alphavantage.co/query?apikey=${AV_API_KEY}`

const getDailyData = async (symbol: string) => {
  const url = `${AV_API_URL}&function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full`

  const response = await fetch(url)

  const data = await response.json()
  const timeZone = data['Meta Data']['6. Time Zone']
  const timeSeries = data['Time Series (Daily)']

  return Object.keys(timeSeries)
    .map((d) => ({ ...timeSeries[d], date: parseDate(d, timeZone) }))
    .map((d) => {
      const close = roundTo(parseFloat(d['4. close']))
      const ratio = roundTo(parseFloat(d['5. adjusted close']) / close)

      return [
        roundTo(parseFloat(d['1. open']) * ratio),
        roundTo(parseFloat(d['2. high']) * ratio),
        roundTo(parseFloat(d['3. low']) * ratio),
        close * ratio,
        roundTo(parseFloat(d['6. volume'])),
        d.date.getTime(),
      ]
    })
    .reverse()
}

const getHourlyData = async (symbol: string) => {
  const url = `${AV_API_URL}&function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&outputsize=full`

  const response = await fetch(url)

  const data = await response.json()
  const timeZone = data['Meta Data']['6. Time Zone']
  const timeSeries = data['Time Series (60min)']

  return Object.keys(timeSeries)
    .map((d) => ({ ...timeSeries[d], date: parseDate(d, timeZone) }))
    .map((d) => [
      roundTo(parseFloat(d['1. open'])),
      roundTo(parseFloat(d['2. high'])),
      roundTo(parseFloat(d['3. low'])),
      roundTo(parseFloat(d['4. close'])),
      roundTo(parseFloat(d['5. volume'])),
      d.date.getTime(),
    ])
    .reverse()
}

export { getDailyData, getHourlyData }
