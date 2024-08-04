import { PrismaLoanRepository } from '@/repositories/prisma/prisma-loan-repository'
import { GetLoansUseCase } from '@/use-cases/get-loans'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getLoansRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/loans',
    {
      schema: {
        tags: ['loans'],
        summary: 'Obtém todos os empréstimos',
        response: {
          200: z.object({
            loans: z.array(
              z.object({
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
              })
            ),
          }),
        },
      },
    },
    async (req, res) => {
      const loanRepository = new PrismaLoanRepository()
      const getLoansUseCase = new GetLoansUseCase(loanRepository)

      const { loans } = await getLoansUseCase.execute()

      return res.status(200).send({
        loans,
      })
    }
  )
}
