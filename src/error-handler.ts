import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { CustomError } from './use-cases/_errors/custom-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, req, res) => {
  if (error instanceof ZodError) {
    return res.status(400).send({
      message: 'Ocorreu um erro de validação',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof CustomError) {
    return res.status(400).send({
      message: error.message,
    })
  }

  console.error(error)

  return res.status(500).send({
    message: 'Internal server error',
  })
}
