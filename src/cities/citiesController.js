import { citiesModel } from './citiesModel.js'
import { contentTypes } from '../../utils/contentTypes.js'

const env = process.env

export class citiesController {
  static async populateCities (req, res) {
    if (typeof (env.GEONAME_STATE_ID) === 'undefined') {
      res.writeHead(500, { 'Content-Type': contentTypes.json })
      res.end(JSON.stringify({ error: 'GEONAME_STATE_ID is not defined' }))
      return
    }

    if (typeof (env.GEONAME_USER) === 'undefined') {
      res.writeHead(500, { 'Content-Type': contentTypes.json })
      res.end(JSON.stringify({ error: 'GEONAME_USER is not defined' }))
      return
    }

    // Fetch for children
    fetch(`http://api.geonames.org/childrenJSON?geonameId=${env.GEONAME_STATE_ID}&username=${env.GEONAME_USER}`)
      .then(response => {
        if (response.ok) return response.json()

        throw new Error('Something went wrong fetching the children')
      }).then(async (data) => {
        const citiesRaw = data.geonames
        const cities = []

        citiesRaw.forEach(city => {
          cities.push({
            name: city.toponymName,
            lat: city.lat,
            lng: city.lng
          })
        })

        // Clean the data
        await this.deleteAllCities()

        // Save in the database
        res.writeHead(200, { 'Content-Type': contentTypes.json })
        res.end(JSON.stringify(await citiesModel.saveCities(cities)))
      })
  }

  static async getCities (req, res) {
    return await citiesModel.getCities()
  }

  static async deleteAllCities (req, res) {
    return await citiesModel.deleteAllCities()
  }
}
