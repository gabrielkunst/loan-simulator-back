import { LoanRepository } from '@/repositories/loan-repository'
import { Loan } from '@prisma/client'

type GetLoansUseCaseReturn = {
  loans: Loan[]
}

export class GetLoansUseCase {
  constructor(private loanRepository: LoanRepository) {}

  async execute(): Promise<GetLoansUseCaseReturn> {
    const loans = await this.loanRepository.getLoans()

    return {
      loans,
    }
  }
}
