import express from 'express'
import helmet from 'helmet'
import emailRoutes from './routes/email.routes.js'
import { apiLimiter } from './middlewares/rateLimiter.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js'

const app = express()

app.use(helmet())
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api', apiLimiter)
app.use('/api/email', emailRoutes)

app.use(notFound)
app.use(errorHandler)

export default app