import { LoanRepository } from '@/repositories/loan-repository'
import {
  INTEREST_RATES,
  MIN_LOAN_AMOUNT,
  MIN_MONTHLY_PAYMENT_RATE,
} from '@/utils/contants'
import { Loan } from '@prisma/client'
import { InvalidLoanAmountError } from './_errors/invalid-loan-amount-error'
import { formatCurrency } from '@/utils/functions/format-currency'
import { InvalidMonthlyPaymentAmountError } from './_errors/invalid-monthly-payment-amount-error'
import { InvalidInterestRateError } from './_errors/invalid-interest-rate-error'
import { BadRequestError } from './_errors/bad-request-error'

type CreateLoanUseCaseParams = {
  loanAmount: number
  monthlyPayment: number
  uf: string
  cpf: string
  birthdate: string
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
      if (loanAmount < MIN_LOAN_AMOUNT) {
        throw new InvalidLoanAmountError(
          `O valor do empréstimo deve ser de no mínimo ${formatCurrency(
            MIN_LOAN_AMOUNT
          )}`
        )
      }

      const minMonthlyPayment = loanAmount * MIN_MONTHLY_PAYMENT_RATE

      if (monthlyPayment < minMonthlyPayment) {
        throw new InvalidMonthlyPaymentAmountError(
          `O valor da parcela deve ser de no mínimo ${formatCurrency(
            minMonthlyPayment
          )}`
        )
      }

      if (
        !interestRate ||
        !Object.values(INTEREST_RATES).includes(interestRate)
      ) {
        throw new InvalidInterestRateError(
          `A taxa de juros deve ser uma das seguintes: ${Object.values(
            INTEREST_RATES
          ).join(', ')}`
        )
      }

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
        throw new BadRequestError(error.message)
      }

      throw error
    }
  }
}
