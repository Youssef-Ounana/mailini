import { rateLimit } from 'express-rate-limit'
import { AppError } from '../utils/AppError.js'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError(429, 'RATE_LIMITED', 'Trop de requêtes. Réessayez dans quelques minutes.'))
  },
})