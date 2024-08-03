import { LoanRepository } from '@/repositories/loan-repository'
import { ResourceNotFoundError } from './_errors/resource-not-found-error'
import { Loan } from '@prisma/client'
import { BadRequestError } from './_errors/bad-request-error'

type GetLoanUseCaseReturn = {
  loan: Loan
}

export class GetLoanUseCase {
  constructor(private readonly loanRepository: LoanRepository) {}

  async execute(loanId: string): Promise<GetLoanUseCaseReturn> {
    try {
      const loan = await this.loanRepository.getLoan(loanId)

      if (!loan) {
        throw new ResourceNotFoundError('Empréstimo não encontrado')
      }

      return {
        loan,
      }
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new BadRequestError(error.message)
      }

      throw error
    }
  }
}
