import { FastifyInstance } from 'fastify'
import { createLoanRoute } from './create-loan-route'
import { simulateLoanRoute } from './simulate-loan-route'
import { getLoanByIdRoute } from './get-loan-by-id-route'
import { getLoansRoute } from './get-loans-route'

export async function appRoutes(app: FastifyInstance) {
  app.register(getLoanByIdRoute)
  app.register(getLoansRoute)
  app.register(createLoanRoute)
  app.register(simulateLoanRoute)
}
