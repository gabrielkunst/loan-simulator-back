import { SimulateLoanUseCase } from '@/use-cases/simulate-loan'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function simulateLoanRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/loans/simulation',
    {
      schema: {
        tags: ['simulations'],
        summary: 'Realiza uma simulação de empréstimo',
        body: z.object({
          loanAmount: z.number(),
          monthlyPayment: z.number(),
          uf: z.string(),
        }),
        response: {
          200: z.object({
            simulation: z.object({
              requestedAmount: z.number(),
              interestRate: z.number(),
              monthlyPayment: z.number(),
              numberOfInstallments: z.number(),
              totalInterest: z.number(),
              totalPayment: z.number(),
              installments: z.array(
                z.object({
                  outstandingBalance: z.number(),
                  interest: z.number(),
                  adjustedBalance: z.number(),
                  installmentAmount: z.number(),
                  dueDate: z.string(),
                })
              ),
            }),
          }),
        },
      },
    },
    async (req, res) => {
      const { loanAmount, monthlyPayment, uf } = req.body

      const simulateLoanUseCase = new SimulateLoanUseCase()
      const simulation = simulateLoanUseCase.execute({
        loanAmount,
        monthlyPayment,
        uf,
      })

      return res.status(200).send({
        simulation,
      })
    }
  )
}
