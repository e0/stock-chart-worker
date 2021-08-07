declare const STOCK_CHART_KV: KVNamespace

const uploadImage = async (
  symbol: string,
  timeframe: string,
  dateString: string,
  image: string,
) => {
  const key = `image-${symbol}-${timeframe}-${dateString}`
  await STOCK_CHART_KV.put(key, image)
}

const getImage = async (
  symbol: string,
  timeframe: string,
  dateString: string,
) => {
  const key = `image-${symbol}-${timeframe}-${dateString}`
  return await STOCK_CHART_KV.get(key)
}

export { uploadImage, getImage }
