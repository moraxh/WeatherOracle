import { connect2DB } from '../database.js'

// Database
const client = await connect2DB()
const db = client.db(process.env.DATABASE_NAME)

const cForecasts = db.collection('forecasts')

export class forecastModel {
  static async saveForecast (forecasts) {
    return await cForecasts.insertMany(forecasts)
  }

  static async getForecast () {
    return await cForecasts.find({}).toArray()
  }

  static async deleteAllForecasts () {
    return await cForecasts.deleteMany({})
  }
}
