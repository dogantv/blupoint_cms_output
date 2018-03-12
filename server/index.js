import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import bodyParser from 'body-parser'
import cors from 'cors'

import api from './api'

const app = express()
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000
app.origin = process.env.ORIGIN || 'http://localhost:3000'

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

let corsOptions = {
  origin: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.set('port', port)

// Import API Routes
app.use('/api', api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

let MongoClient = require('mongodb').MongoClient

console.log('Mongo URL: ' + config.env.mongoUrl)
MongoClient.connect(config.env.mongoUrl, function (err, db) {
  if (err) throw err
  console.log('Connected to mongodb')
  app.db = db.db()
})

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
