import { Router } from 'worktop'
import { listen } from 'worktop/cache'
import { loadTimeSeries } from './timeseries'

const API = new Router()

API.add('GET', '/:symbol', async (req, res) => {
  const { symbol } = req.params

  if (!symbol) {
    return res.send(400, 'Error parsing request')
  }

  const full = !!req.query.get('full')
  const series = await loadTimeSeries(symbol.toUpperCase(), full)
  res.send(200, series)
})

listen(API.run)
