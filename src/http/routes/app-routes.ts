import { FastifyInstance } from 'fastify'
import { createLoanRoute } from './create-loan-route'
import { simulateLoanRoute } from './simulate-loan-route'
import { getLoanRoute } from './get-loan-route'

export async function appRoutes(app: FastifyInstance) {
  app.register(getLoanRoute)
  app.register(createLoanRoute)
  app.register(simulateLoanRoute)
}
