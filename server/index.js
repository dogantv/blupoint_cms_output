import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import compression from 'compression'

import api from './api'

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const app = express()
app.config = config

const host = process.env.HOST
const port = process.env.PORT

app.use(compression())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

let corsOptions = {
  origin: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.use(helmet({
  noCache: true
}))

app.use(cookieParser())
app.use(session({
  secret: 'GjL/*8912',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.set('port', port)

// Import API Routes
app.use('/api', api)

let MongoClient = require('mongodb').MongoClient

console.log('Mongo URL: ' + process.env.MONGO_URL)
MongoClient.connect(process.env.MONGO_URL, function (err, db) {
  if (err) throw err
  console.log('Connected to mongodb')
  app.db = db.db()

  console.log('Checking mongodb indexes')
  app.db.collection('outputs').ensureIndex({'membership_id': 1, 'domain_id': 1, 'slug': 1}, {background: true, unique: true})
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
