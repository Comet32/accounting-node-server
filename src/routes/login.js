import config from '../utils/config.js'

class Login {
  post(req, res) {
    let data = ''

    req.on('data', (chunk) => {
      data += chunk
    })

    req.on('end', async () => {
      const { password } = JSON.parse(data)
      const defaultConfig = await config.read()
      console.log(`password`, password)
      console.log(`defaultConfig.password`, defaultConfig.password)
      if (password === defaultConfig.password) {
        res.end()
      } else {
        res.writeHead(500)
        res.end()
      }
    })
  }
}

export default Login
