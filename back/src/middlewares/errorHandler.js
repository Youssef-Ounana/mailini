import { AppError } from '../utils/AppError.js'

export function notFound(req, res, next) {
  next(new AppError(404, 'NOT_FOUND', `Route introuvable : ${req.method} ${req.originalUrl}`))
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    err = new AppError(400, 'INVALID_JSON', "Le corps de la requête n'est pas un JSON valide")
  } else if (err.type === 'entity.too.large') {
    err = new AppError(413, 'PAYLOAD_TOO_LARGE', 'La requête est trop volumineuse')
  }

  const isKnown = err instanceof AppError
  if (!isKnown) console.error(err)

  res.status(isKnown ? err.statusCode : 500).json({
    error: {
      code: isKnown ? err.code : 'INTERNAL_ERROR',
      message: isKnown ? err.message : 'Une erreur interne est survenue',
      ...(isKnown && err.details && { details: err.details }),
    },
  })
}