import { Router } from 'express'
import { validate } from '../middlewares/validate.js'
import { analyzeSchema, generateSchema } from '../schemas/email.schema.js'
import { analyze, generate, plan, reply } from '../controllers/emailController.js'
import { replySchema } from '../schemas/reply.schema.js'


const router = Router()

router.post('/analyze', validate(analyzeSchema), analyze)
router.post('/generate', validate(generateSchema), generate)
router.post('/plan', validate(analyzeSchema), plan)
router.post('/reply', validate(replySchema), reply)

export default router