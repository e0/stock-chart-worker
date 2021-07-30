import { Router } from 'worktop'
import { listen } from 'worktop/cache'
import * as CORS from 'worktop/cors'
import { loadTimeSeries } from './timeseries'
import { uploadImage, getImage } from './image'

const API = new Router()

API.prepare = CORS.preflight({
  origin: '*',
  headers: ['Cache-Control', 'Content-Type', 'X-Count'],
  methods: ['GET', 'HEAD', 'PATCH'],
})

API.add('GET', '/timeseries/:symbol', async (req, res) => {
  const { symbol } = req.params

  if (!symbol) {
    return res.send(400, 'Error parsing request')
  }

  const full = !!req.query.get('full')
  const series = await loadTimeSeries(symbol.toUpperCase(), full)
  res.send(200, series)
})

API.add('POST', '/images/:symbol', async (req, res) => {
  const { symbol } = req.params
  const { image }: any = await req.body()

  if (!symbol || !image) {
    return res.send(400, 'Error parsing request')
  }

  await uploadImage(symbol.toUpperCase(), image)

  res.send(200)
})

API.add('GET', '/images/:symbol', async (req, res) => {
  const { symbol } = req.params

  if (!symbol) {
    return res.send(400, 'Error parsing request')
  }

  const image = await getImage(symbol.toUpperCase())
  res.send(200, image)
})

listen(API.run)
