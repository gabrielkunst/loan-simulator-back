import { PrismaLoanRepository } from '@/repositories/prisma/prisma-loan-repository'
import { CreateLoanUseCase } from '@/use-cases/create-loan'
import { SimulateLoanUseCase } from '@/use-cases/simulate-loan'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createLoanRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/loans',
    {
      schema: {
        tags: ['loans'],
        summary: 'Cria um novo empréstimo',
        body: z.object({
          loanAmount: z.number(),
          monthlyPayment: z.number(),
          uf: z.string(),
          cpf: z.string(),
          birthdate: z.string(),
        }),
        response: {
          201: z.object({
            loanId: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { birthdate, cpf, loanAmount, monthlyPayment, uf } = req.body

      const loanRepository = new PrismaLoanRepository()
      const createLoanUseCase = new CreateLoanUseCase(loanRepository)
      const simulateLoanUseCase = new SimulateLoanUseCase()

      const simulationResult = simulateLoanUseCase.execute({
        loanAmount,
        monthlyPayment,
        uf,
      })

      const { loan } = await createLoanUseCase.execute({
        birthdate,
        cpf,
        uf,
        interestRate: simulationResult.interestRate,
        loanAmount: simulationResult.requestedAmount,
        monthlyPayment: simulationResult.monthlyPayment,
        numberOfInstallments: simulationResult.numberOfInstallments,
        totalInterest: simulationResult.totalInterest,
        totalPayment: simulationResult.totalPayment,
      })

      return res.status(201).send({
        loanId: loan.id,
      })
    }
  )
}
