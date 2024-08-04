import { LoanRepository } from '@/repositories/loan-repository'
import { Loan } from '@prisma/client'
import { InvalidLoanAmountError } from './_errors/invalid-loan-amount-error'
import { InvalidMonthlyPaymentAmountError } from './_errors/invalid-monthly-payment-amount-error'
import { InvalidInterestRateError } from './_errors/invalid-interest-rate-error'
import { CustomError } from './_errors/custom-error'
import { LoanValidator } from '@/utils/loan-validator'

type CreateLoanUseCaseParams = {
  loanAmount: number
  monthlyPayment: number
  uf: string
  cpf: string
  birthdate: string | Date
  interestRate: number
  numberOfInstallments: number
  totalInterest: number
  totalPayment: number
}

type CreateLoanUseCaseReturn = {
  loan: Loan
}

export class CreateLoanUseCase {
  constructor(private readonly loanRepository: LoanRepository) {}

  async execute({
    cpf,
    birthdate,
    loanAmount,
    monthlyPayment,
    uf,
    interestRate,
    numberOfInstallments,
    totalInterest,
    totalPayment,
  }: CreateLoanUseCaseParams): Promise<CreateLoanUseCaseReturn> {
    try {
      LoanValidator.validateLoanAmount(loanAmount)
      LoanValidator.validateMonthlyPayment(loanAmount, monthlyPayment)
      LoanValidator.validateInterestRate(uf, interestRate)

      const loan = await this.loanRepository.create({
        birthdate,
        cpf,
        loanAmount,
        monthlyPayment,
        uf,
        numberOfInstallments,
        totalInterest,
        totalPayment,
        interestRate,
      })

      return {
        loan,
      }
    } catch (error) {
      if (
        error instanceof InvalidLoanAmountError ||
        error instanceof InvalidMonthlyPaymentAmountError ||
        error instanceof InvalidInterestRateError
      ) {
        throw new CustomError(error.message)
      }

      throw error
    }
  }
}
