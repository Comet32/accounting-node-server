class Account {
  get(req, res, db, id) {
    console.log('GET!')
    const resData = JSON.stringify(db.data)
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': resData.length,
    })
    res.end(resData)
  }
  post(req, res, db, id) {
    console.log('POST!')
    let data = ''

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
  }

  put(req, res, db, id) {
    console.log('PUT!')
    const entry = db.data.find((entry) => entry.id === id)
    const index = db.data.findIndex((entry) => entry.id === id)
    const { createDate } = entry

    let data = ''

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
  }
  delete(req, res, db, id) {
    console.log('DELETE!')
    const index = db.data.findIndex((entry) => entry.id === id)
    db.data.splice(index, 1)
    db.write()
    res.end()
  }
}

export default Account
