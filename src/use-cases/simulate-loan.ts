import {
  INTEREST_RATES,
  MIN_LOAN_AMOUNT,
  MIN_MONTHLY_PAYMENT_RATE,
} from '@/utils/contants'
import { formatCurrency } from '@/utils/functions/format-currency'
import { calculateInstallments } from '@/utils/functions/calculate-installments'
import { InvalidLoanAmountError } from './_errors/invalid-loan-amount-error'
import { InvalidMonthlyPaymentAmountError } from './_errors/invalid-monthly-payment-amount-error'
import { InvalidInterestRateError } from './_errors/invalid-interest-rate-error'

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
}

export class SimulateLoanUseCase {
  execute({
    uf,
    loanAmount,
    monthlyPayment,
  }: SimulateLoanUseCaseParams): SimulateLoanUseCaseReturn {
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

    const interestRate = INTEREST_RATES[uf]

    if (!interestRate) {
      throw new InvalidInterestRateError(
        `Não é possível simular empréstimos para o estado ${uf}. Os estados disponíveis são: ${Object.keys(
          INTEREST_RATES
        ).join(', ')}`
      )
    }

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
    }
  }
}
