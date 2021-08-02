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

export { roundTo, secondsUntilNextWeekday, formatNumber }
