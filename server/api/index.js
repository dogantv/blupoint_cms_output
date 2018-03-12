import { Router } from 'express'

import outputs from './outputs'

const router = Router()

// Add OUTPUTS Routes
router.use(outputs)

export default router
