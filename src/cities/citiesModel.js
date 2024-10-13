import { connect2DB } from '../database.js'

// Database
const client = await connect2DB()
const db = client.db(process.env.DATABASE_NAME)

const cCities = db.collection('cities')

export class citiesModel {
  static async getCities () {
    return await cCities.find({}).toArray()
  }

  static async saveCities (cities) {
    return await cCities.insertMany(cities)
  }

  static async deleteAllCities () {
    return await cCities.deleteMany({})
  }
}
