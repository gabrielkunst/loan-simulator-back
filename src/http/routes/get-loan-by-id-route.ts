import { PrismaLoanRepository } from '@/repositories/prisma/prisma-loan-repository'
import { GetLoanByIdUseCase } from '@/use-cases/get-loan-by-id'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getLoanByIdRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/loans/:loanId',
    {
      schema: {
        tags: ['loans'],
        summary: 'Obtém um empréstimo pelo ID',
        params: z.object({
          loanId: z.string(),
        }),
        response: {
          200: z.object({
            loan: z.object({
              id: z.string(),
              cpf: z.string(),
              uf: z.string(),
              birthdate: z.date(),
              loanAmount: z.number(),
              monthlyPayment: z.number(),
              numberOfInstallments: z.number(),
              totalPayment: z.number(),
              interestRate: z.number(),
              totalInterest: z.number(),
              createdAt: z.date(),
            }),
          }),
        },
      },
    },
    async (req, res) => {
      const { loanId } = req.params

      const loanRepository = new PrismaLoanRepository()
      const getLoanByIdUseCase = new GetLoanByIdUseCase(loanRepository)

      const { loan } = await getLoanByIdUseCase.execute(loanId)

      return res.status(200).send({
        loan,
      })
    }
  )
}
