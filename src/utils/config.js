import fs from 'fs'
import { URL, fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)
const configPath = path.join(__dirname, '../../db/config.json')

export async function read() {
  return new Promise((resolve, reject) => {
    fs.readFile(configPath, (err, buffer) => {
      if (err) {
        return reject(err)
      }
      const jsonStr = buffer.toString()
      const config = JSON.parse(jsonStr)
      resolve(config)
    })
  })
}

export default {
  read,
}
