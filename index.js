import { getEnv } from './utils/dotenv.js'
import { server } from './src/server.js'
await getEnv()
const port = process.env.PORT

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
