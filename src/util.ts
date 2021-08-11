const roundTo = (num: number) => Math.round(num * 100) / 100

const secondsUntilNextWeekday = () => {
  const currentNYTime = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
  })
  const now = new Date(currentNYTime)
  const then = new Date(now)
  if (now.getDay() >= 5) {
    then.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7))
  }
  then.setHours(24, 0, 0, 0)
  return (Number(then) - Number(now)) / 1000
}

const shouldTryToRefresh = (timestamp: number) => {
  const inRefreshTimeframe = secondsUntilNextWeekday() < 7.5 * 60 * 60 // 16:30 - 00:00

  if (!inRefreshTimeframe) {
    return
  }
  const date = new Date(timestamp).getDate()
  const currentDate = new Date().getDate()

  return date !== currentDate
}

const formatNumber = (n: number) => {
  const num = Number(n)

  return Math.abs(num) >= 1.0e12
    ? (num / 1.0e12).toFixed(2) + ' T'
    : Math.abs(num) >= 1.0e9
    ? (num / 1.0e9).toFixed(2) + ' B'
    : Math.abs(num) >= 1.0e6
    ? (num / 1.0e6).toFixed(2) + ' M'
    : Math.abs(num) >= 1.0e3
    ? (num / 1.0e3).toFixed(2) + ' K'
    : num.toFixed(2)
}

const getWeek = (_d: Date) => {
  const d = new Date(Date.UTC(_d.getFullYear(), _d.getMonth(), _d.getDate()))

  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))

  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))

  // Calculate full weeks to nearest Thursday
  return Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7)
}

const parseDate = (dateString: string, timeZone: string) => {
  const [date, time] = dateString.split(' ')
  const [y, m, d] = date.split('-').map((x) => parseInt(x))
  const [hr, min, sec] = time
    ? time.split(':').map((x) => parseInt(x))
    : [16, 0, 0]

  let _date = new Date(Date.UTC(y, m - 1, d, hr, min, sec))
  let utcDate = new Date(_date.toLocaleString('en-US', { timeZone: 'UTC' }))
  let tzDate = new Date(_date.toLocaleString('en-US', { timeZone }))
  let offset = utcDate.getTime() - tzDate.getTime()
  _date.setTime(_date.getTime() + offset)
  return _date
}

export {
  roundTo,
  secondsUntilNextWeekday,
  shouldTryToRefresh,
  formatNumber,
  getWeek,
  parseDate,
}
