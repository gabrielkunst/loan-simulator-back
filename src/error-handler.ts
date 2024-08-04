import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { BadRequestError } from './use-cases/_errors/bad-request-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, req, res) => {
  if (error instanceof ZodError) {
    return res.status(400).send({
      message: 'Ocorreu um erro de validação',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequestError) {
    return res.status(400).send({
      message: error.message,
    })
  }

  console.error(error)

  return res.status(500).send({
    message: 'Internal server error',
  })
}
