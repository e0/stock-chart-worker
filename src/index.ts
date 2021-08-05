import { Router } from 'worktop'
import { listen } from 'worktop/cache'
import * as CORS from 'worktop/cors'
import { loadChartData } from './chartData'
import { uploadImage, getImage } from './image'

const API = new Router()

API.prepare = CORS.preflight({
  origin: '*',
  headers: ['Cache-Control', 'Content-Type', 'X-Count'],
  methods: ['GET', 'HEAD', 'PATCH'],
})

API.add('GET', '/chart-data/:symbol', async (req, res) => {
  const { symbol } = req.params

  if (!symbol) {
    return res.send(400, 'Error parsing request')
  }

  const chartData = await loadChartData(symbol.toUpperCase())
  res.send(200, chartData)
})

const validTimeFrames = ['daily', 'weekly', 'monthly']

API.add('POST', '/images/:symbol/:timeframe', async (req, res) => {
  const { symbol, timeframe } = req.params
  const s = symbol && symbol.toUpperCase()
  const t = symbol && timeframe.toLowerCase()

  const { image }: any = await req.body()

  if (!s || !t || !validTimeFrames.includes(t) || !image) {
    return res.send(400, 'Error parsing request')
  }

  await uploadImage(s, t, image)

  res.send(200)
})

API.add('GET', '/images/:symbol/:timeframe', async (req, res) => {
  const { symbol, timeframe } = req.params
  const s = symbol && symbol.toUpperCase()
  const t = symbol && timeframe.toLowerCase()

  if (!s || !t || !validTimeFrames.includes(t)) {
    return res.send(400, 'Error parsing request')
  }

  const image = await getImage(s, t)
  image ? res.send(200, image) : res.send(404)
})

listen(API.run)
