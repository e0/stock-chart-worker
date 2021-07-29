import { Router } from 'worktop'
import { listen } from 'worktop/cache'

const API = new Router()

API.add('GET', '/', (req, res) => {
  res.send(200, 'hello world')
})

listen(API.run)
