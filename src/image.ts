import { secondsUntilNextWeekday } from './util'

declare const STOCK_CHART_KV: KVNamespace

const uploadImage = async (
  symbol: string,
  timeframe: string,
  image: string,
) => {
  const key = `image-${symbol}-${timeframe}`
  await STOCK_CHART_KV.put(key, image, {
    expirationTtl: secondsUntilNextWeekday(),
  })
}

const getImage = async (symbol: string, timeframe: string) => {
  const key = `image-${symbol}-${timeframe}`
  return await STOCK_CHART_KV.get(key)
}

export { uploadImage, getImage }
