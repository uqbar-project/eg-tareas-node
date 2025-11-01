import type { NextFunction, Request, Response } from 'express'
import { DomainError, NotFoundError } from './errors.js'

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(`[Error Middleware] ${err.name}: ${err.message}`)
  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: err.message })
  }
  if (err instanceof DomainError) {
    return res.status(400).json({ message: err.message })
  }
  return res.status(500).json({ message: 'Error interno del servidor' })
}
