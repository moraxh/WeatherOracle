import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const dirname = fileURLToPath(import.meta.url)
const envpath = path.join(dirname, '..', '..', '.env')

export const getEnv = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(envpath, 'utf8', (err, data) => {
      if (err) throw err

      if (data.length === 0) {
        console.log('.env is empty')
      }

      // Parse .env
      const lines = data.split('\n')

      lines.forEach(line => {
        line = line.replace('\r', '').replace(' ', '')
        if (line.startsWith('#') || line.length === 0) {
          return
        }

        const [key, value] = line.split('=')

        process.env[key] = value
      })

      resolve()
    })
  })
}
