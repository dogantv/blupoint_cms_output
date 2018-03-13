import {
  Router
} from 'express'
import axios from 'axios'

import outputs from './outputs'
import output from './output'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    let {data} = await axios.post('api/tokens', req.body, {
      baseURL: req.app.config.env.apiBaseUrl
    })

    console.log(data)
    req.session.user = req.body.username
    console.log(req.session)

    res.json(data)
  } catch (e) {
    next(e)
  }
})

router.post('/logout', async (req, res, next) => {
  try {
    req.session.destroy(function (err) {
      console.log('Logged out', err)
    })
    res.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

// Add OUTPUTS Routes
router.use(outputs)

// Add OUTPUT Routes
router.use(output)

export default router
