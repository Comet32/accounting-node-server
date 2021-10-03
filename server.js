import { Low, JSONFile } from 'lowdb'
import http from 'http'
import { URL } from 'url'

const adapter = new JSONFile('./db.json')
const db = new Low(adapter)

const server = http.createServer(async (req, res) => {
  const { method, url } = req
  const myURL = new URL(url, 'http://localhost:8080')
  const { pathname } = myURL
  const { id } = pathname.match(/\/(?<id>\d+)/)?.groups || {}

  await db.read()
  db.data = db.data || []
  console.log(`method===`, method)
  if (method === 'GET') {
    console.log(`db.data`, db.data)
    const resData = JSON.stringify(db.data)
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': resData.length,
    })

    res.end(resData)
  } else if (method === 'POST') {
    let data = ''
    res.writeHead(200)

    req.on('data', (chunk) => {
      data += chunk
    })

    req.on('end', () => {
      const entry = JSON.parse(data)
      db.data.push({
        ...entry,
        id: Date.now().toString(),
        createDate: Date.now(),
        updateDate: Date.now(),
      })

      db.write()
      res.end()
    })
  } else if (method === 'PUT') {
    const entry = db.data.find((entry) => entry.id === id)
    const index = db.data.findIndex((entry) => entry.id === id)
    const { createDate } = entry

    let data = ''
    res.writeHead(200)

    req.on('data', (chunk) => {
      data += chunk
    })

    req.on('end', () => {
      const entry = JSON.parse(data)
      db.data.splice(index, 1, {
        ...entry,
        id,
        createDate,
        updateDate: Date.now(),
      })

      db.write()
      res.end()
    })
  } else if (method === 'DELETE') {
    res.writeHead(200)
    const index = db.data.findIndex((entry) => entry.id === id)
    db.data.splice(index, 1)
    db.write()
    res.end()
  }
})

server.listen(8088, () => {
  console.log('server run!!!')
})
