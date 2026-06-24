import type { ArgumentsHost } from '@nestjs/common'
import { Catch, type ExceptionFilter, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainError'
  }
}

@Catch(NotFoundError, DomainError, Error)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    console.error(`[Error Middleware] ${exception.name}: ${exception.message}`)

    if (exception instanceof NotFoundError) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: exception.message })
    }
    if (exception instanceof DomainError) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: exception.message })
    }
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error interno del servidor' })
  }
}
