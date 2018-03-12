import { Router } from 'express'
const ObjectID = require('mongodb').ObjectID
const validate = require('jsonschema').validate

const SCHEMA = {
  'id': '/Outout',
  'type': 'object',
  'properties': {
    'id': {'type': 'string'},
    'name': {'type': 'string'},
    'slug': {'type': 'string'},
    'domain_id': {'type': 'string'},
    'platform_id': {'type': 'string'},
    'datasource_id': {'type': 'string'},
    'template': {'type': 'string'}
  },
  'required': ['name', 'slug', 'domain_id', 'platform_id', 'datasource_id', 'template']
}

const router = Router()

router.use(function checkOrigin (req, res, next) {
  if (['POST', 'PUT', 'DELETE'].includes(req.method.toUpperCase()) && req.headers['origin'] !== req.app.origin) {
    res.sendStatus(401)
    return
  }
  next()
})

/* GET users listing. */
router.get('/outputs', async (req, res, next) => {
  try {
    let outputs = await req.app.db.collection('outputs').find({}).toArray()
    res.json({
      'data': {
        'items': outputs,
        'count': outputs.length
      }
    })
  } catch (e) {
    next(e)
  }
})

/* GET output by ID. */
router.get('/outputs/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    let output = await req.app.db.collection('outputs').findOne({'_id': ObjectID(id)})
    if (!output) {
      res.send(404)
    }
    res.json(output)
  } catch (e) {
    next(e)
  }
})

router.post('/outputs', async (req, res, next) => {
  let output = req.body
  try {
    validate(output, SCHEMA, {
      throwError: true
    })
  } catch (e) {
    res.status(400).json(e)
    return
  }
  try {
    output.sys = {
      created_at: new Date()
    }
    await req.app.db.collection('outputs').insertOne(output)
    res.json(output)
  } catch (e) {
    next(e)
  }
})

router.put('/outputs/:id', async (req, res, next) => {
  let output = req.body
  try {
    validate(output, SCHEMA, {
      throwError: true
    })
  } catch (e) {
    res.status(400).json(e)
    return
  }
  try {
    const id = req.params.id
    delete output._id
    delete output.sys

    let _output = await req.app.db.collection('outputs').findOne({'_id': ObjectID(id)})

    _output = Object.assign(_output, output)
    _output.sys.modified_at = new Date()
    await req.app.db.collection('outputs').save(_output)
    res.json(_output)
  } catch (e) {
    next(e)
  }
})

router.delete('/outputs/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    await req.app.db.collection('outputs').deleteOne({'_id': ObjectID(id)})
    res.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

export default router
