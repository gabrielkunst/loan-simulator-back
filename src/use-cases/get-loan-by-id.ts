import { LoanRepository } from '@/repositories/loan-repository'
import { ResourceNotFoundError } from './_errors/resource-not-found-error'
import { Loan } from '@prisma/client'
import { CustomError } from './_errors/custom-error'

type GetLoanUseCaseReturn = {
  loan: Loan
}

export class GetLoanByIdUseCase {
  constructor(private readonly loanRepository: LoanRepository) {}

  async execute(loanId: string): Promise<GetLoanUseCaseReturn> {
    try {
      const loan = await this.loanRepository.getLoanById(loanId)

      if (!loan) {
        throw new ResourceNotFoundError('Empréstimo não encontrado')
      }

      return {
        loan,
      }
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new CustomError(error.message)
      }

      throw error
    }
  }
}
