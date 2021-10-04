import { Low, JSONFile } from 'lowdb'
import http from 'http'
import { URL, fileURLToPath } from 'url'
import path from 'path'
import Routes from './routes/index.js'

const routes = new Routes()

const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)
const accountDBPath = path.join(__dirname, '../db/account.json')
const adapter = new JSONFile(accountDBPath)
const db = new Low(adapter)

const server = http.createServer(async (req, res) => {
  const { method, url } = req
  const myURL = new URL(url, 'http://localhost:8080')
  const { pathname } = myURL
  console.log(`myURL`, myURL)
  const { id } = pathname.match(/\/\w+\/(?<id>\d+)/)?.groups || {}
  const { route } = pathname.match(/\/(?<route>\w+)/)?.groups || {}

  await db.read()
  db.data = db.data || []

  routes[route][method.toLowerCase()](req, res, db, id)
})

server.listen(8088, () => {
  console.log('server run!!!')
})
