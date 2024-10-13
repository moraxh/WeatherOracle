import { forecastModel } from './forecastModel.js'
import { citiesController } from '../cities/citiesController.js'
import { contentTypes } from '../../utils/contentTypes.js'

export class forecastController {
  static async getForecast (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(await forecastModel.getForecast()))
  }

  static async populateForecasts (req, res) {
    const lastYears = 5
    const cities = await citiesController.getCities(req, res)

    if (cities.length === 0) {
      res.writeHead(500, { 'Content-Type': contentTypes.json })
      res.end(JSON.stringify({ error: 'No cities found' }))
    }

    const startDateObj = new Date((new Date()).setFullYear(new Date().getFullYear() - lastYears))
    const startDate = `${startDateObj.getFullYear()}-${String(startDateObj.getMonth()).padStart(2, '0')}-${String(startDateObj.getDate()).padStart(2, '0')}`
    const endDateObj = new Date()
    const endDate = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth()).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`

    const lat = []
    const lng = []
    const startDates = []
    const endDates = []
    const timeZones = []

    // Delete all forecasts
    await forecastModel.deleteAllForecasts()

    cities.forEach(async (city) => {
      lat.push(city.lat)
      lng.push(city.lng)
      startDates.push(startDate)
      endDates.push(endDate)
      timeZones.push('auto')
    })

    const uri = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat.join(',')}&longitude=${lng.join(',')}&start_date=${startDates.join(',')}&end_date=${endDates.join(',')}&hourly=temperature_2m,surface_pressure&timezone=${timeZones.join(',')}`

    fetch(uri)
      .then(async (response) => {
        if (!response.ok) {
          res.writeHead(500, { 'Content-Type': contentTypes.json })
          res.end(JSON.stringify({ error: 'Something went wrong' }))
          console.log(response.statusText)
          return
        }

        const cities = await response.json()

        cities.forEach(async (city) => {
          const data = []
          const hourly = city.hourly

          hourly.time.forEach((timestamp, i) => {
            data.push({
              city_id: city._id,
              city_name: city.name,
              timestamp,
              temperature: hourly.temperature_2m[i],
              pressure: hourly.surface_pressure[i]
            })
          })

          await forecastModel.saveForecast(data)
        })

        res.writeHead(200)
        res.end(JSON.stringify({ message: 'Forecasts saved' }))
      })
  }
}
