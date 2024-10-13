import { getEnv } from "../utils/dotenv.js";
import { MongoClient } from "mongodb";

await getEnv();

const url = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@mongo`
const client = new MongoClient(url)

export const connect2DB = () => {
  return new Promise((resolve, reject) => {
    client.connect()
      .then(() => {
        console.log('connected to mongodb')
        resolve(client)
      })
      .catch((err) => {
        console.log('error connecting to mongodb:', err)
        reject(err)
      })
  })
}