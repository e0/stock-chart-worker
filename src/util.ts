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

export { roundTo, secondsUntilNextWeekday }
