import {
  secondsUntilNextWeekday,
  shouldTryToRefresh,
  formatNumber,
  getWeek,
} from './util'
import { getDailyData, getHourlyData } from './dataProviders/alphavantage'

declare const STOCK_CHART_KV: KVNamespace

// const dailyData = [o, h, l, c, v, t]
const calculateAdrPct = (series: any) => {
  const candles = series.slice(series.length - 20, series.length)
  const adr =
    candles.reduce((total: number, d: any) => total + d[1] / d[2], 0) /
      candles.length -
    1
  return parseFloat((100 * adr).toFixed(2))
}

const calculateDollarVol = (series: any) => {
  const candles = series.slice(series.length - 5, series.length)
  const dollar =
    candles.reduce((total: number, d: any) => total + d[3], 0) / candles.length
  const vol =
    candles.reduce((total: number, d: any) => total + d[4], 0) / candles.length
  const dollarVol = dollar * vol
  return formatNumber(dollarVol)
}

const _loadChartData = async (symbol: string) => {
  const cachedString = await STOCK_CHART_KV.get(symbol)

  if (cachedString) {
    const cachedData = JSON.parse(cachedString)
    const { daily } = cachedData.timeseries
    const latestDailyTimestamp = daily[daily.length - 1][5]
    if (!shouldTryToRefresh(latestDailyTimestamp)) {
      return cachedData
    }
  }

  const daily = await getDailyData(symbol)
  const weekly = []
  const monthly = []

  let week, month

  // 1. loop through the daily timeseries
  // 2. populate weekly, and monthly series
  for (let dailyData of daily) {
    const [_o, h, l, c, v, t] = dailyData
    const date = new Date(t)

    const currentWeek = getWeek(date)
    if (currentWeek !== week) {
      // if new week
      weekly[weekly.length] = dailyData
      week = currentWeek
    } else {
      // if same week
      const weekData: any = weekly[weekly.length - 1]
      weekly[weekly.length - 1] = [
        weekData[0],
        h > weekData[1] ? h : weekData[1],
        l < weekData[2] ? l : weekData[2],
        c,
        weekData[4] + v,
        t,
      ]
    }

    const currentMonth = date.getMonth()
    if (currentMonth !== month) {
      // if new month
      monthly[monthly.length] = dailyData
      month = currentMonth
    } else {
      // if same month
      const monthData: any = monthly[monthly.length - 1]
      monthly[monthly.length - 1] = [
        monthData[0],
        h > monthData[1] ? h : monthData[1],
        l < monthData[2] ? l : monthData[2],
        c,
        monthData[4] + v,
        t,
      ]
    }
  }

  const chartData = {
    timeseries: {
      daily,
      weekly,
      monthly,
    },
    adrPct: calculateAdrPct(daily),
    dollarVol: calculateDollarVol(daily),
  }

  await STOCK_CHART_KV.put(symbol, JSON.stringify(chartData), {
    expirationTtl: secondsUntilNextWeekday(),
  })

  return chartData
}

const loadHourlyData = async (symbol: string) => getHourlyData(symbol)

const loadChartData = async (symbol: string) => {
  const cachedString = await STOCK_CHART_KV.get(symbol)

  if (cachedString) {
    const cachedData = JSON.parse(cachedString)
    const { daily } = cachedData.timeseries
    const latestDailyTimestamp = daily[daily.length - 1][5]
    if (!shouldTryToRefresh(latestDailyTimestamp)) {
      return cachedData
    }
  }

  const [_chartData, hourly] = await Promise.all([
    _loadChartData(symbol),
    loadHourlyData(symbol),
  ])

  const chartData = {
    ..._chartData,
    timeseries: {
      ..._chartData.timeseries,
      hourly,
    },
  }

  await STOCK_CHART_KV.put(symbol, JSON.stringify(chartData), {
    expirationTtl: secondsUntilNextWeekday(),
  })

  return chartData
}

export { loadChartData }
