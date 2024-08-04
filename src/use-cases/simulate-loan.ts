import { INTEREST_RATES } from '@/utils/contants'
import { calculateInstallments } from '@/utils/functions/calculate-installments'
import { InvalidLoanAmountError } from './_errors/invalid-loan-amount-error'
import { InvalidMonthlyPaymentAmountError } from './_errors/invalid-monthly-payment-amount-error'
import { InvalidInterestRateError } from './_errors/invalid-interest-rate-error'
import { InstallmentProjection } from '@/types/installment-projection'
import { CustomError } from './_errors/custom-error'
import { LoanValidator } from '@/utils/loan-validator'

type SimulateLoanUseCaseParams = {
  uf: string
  loanAmount: number
  monthlyPayment: number
}

type SimulateLoanUseCaseReturn = {
  requestedAmount: number
  interestRate: number
  monthlyPayment: number
  numberOfInstallments: number
  totalInterest: number
  totalPayment: number
  installments: InstallmentProjection[]
}

export class SimulateLoanUseCase {
  execute({
    uf,
    loanAmount,
    monthlyPayment,
  }: SimulateLoanUseCaseParams): SimulateLoanUseCaseReturn {
    try {
      LoanValidator.validateLoanAmount(loanAmount)
      LoanValidator.validateMonthlyPayment(loanAmount, monthlyPayment)

      const interestRate = INTEREST_RATES[uf]
      LoanValidator.validateInterestRate(uf, interestRate)

      const { installments, totalInterest } = calculateInstallments({
        interestRate,
        loanAmount,
        monthlyPayment,
      })

      return {
        requestedAmount: loanAmount,
        interestRate,
        monthlyPayment,
        numberOfInstallments: installments.length,
        totalInterest,
        totalPayment: loanAmount + totalInterest,
        installments,
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
