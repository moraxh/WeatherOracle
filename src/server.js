import http from 'node:http'
import { contentTypes } from '../utils/contentTypes.js'
import { citiesController } from './cities/citiesController.js'
import { forecastController } from './forecast/forecastController.js'

export const server = http.createServer(async (req, res) => {
  const { url, method } = req

  // Get Methods
  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': contentTypes.plain })
    res.end('Use: \n - GET /populateCities \n - GET /populateForecast')
  } else if (url === '/populateCities' && method === 'GET') {
    await citiesController.populateCities(req, res)
  } else if (url === '/populateForecast' && method === 'GET') {
    await forecastController.populateForecasts(req, res)
  } else { // 404 PAGE
    res.writeHead(404, { 'Content-Type': contentTypes.plain })
    res.end('404 NOOB 😁')
  }
})
