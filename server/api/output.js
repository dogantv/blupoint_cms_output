import { Router } from 'express'
import axios from 'axios'
import Querystring from 'querystring'
import Mustache from 'mustache'
import safeEval from 'safe-eval'
import moment from 'moment'

const router = Router()

/* GET users listing. */
router.get('/domains/:domain_id/:slug', async (req, res, next) => {
  try {
    const domainId = req.params.domain_id
    const slug = req.params.slug

    let output = await req.app.db.collection('outputs').findOne({
      'domain_id': domainId,
      'slug': slug
    })

    if (!output) {
      res.send(404)
    }

    const types = require('../../utils/types.js')

    let _type = types[output.type]

    let baseURL = req.app.config.env.apiDeliveryUrl
    let url = `api/domains/${domainId}/datasources/${output.datasource_slug}/result?${Querystring.stringify(req.query)}`
    let authorization = `Basic ${output.platform_id}:${output.platform_secret}`
    let datasourceTask = axios.get(url, {
      baseURL: baseURL,
      headers: {
        'Authorization': authorization
      }
    })

    let domainTask = axios.get(`api/domains/${domainId}`, {
      baseURL: baseURL,
      headers: {
        'Authorization': authorization
      }
    })

    let promises = await Promise.all([datasourceTask, domainTask])

    let {data} = promises[0]
    let domain = promises[1].data

    let templateData = {
      domain: domain,
      items: data.data.items,
      now: moment().locale('en').format(_type.datetimeFormat),
      formatDate: () => {
        return (text, render) => {
          let date = render(text)
          date = moment(date).locale('en').format(_type.datetimeFormat)
          return date
        }
      }
    }

    if (output.functions) {
      output.functions.forEach(item => {
        templateData[item.name] = safeEval(item.function)
      })
    }

    let response = Mustache.render(output.template, templateData)

    res.set('Content-Type', _type.contentType)
    res.send(response)
  } catch (e) {
    next(e)
  }
})

export default router
