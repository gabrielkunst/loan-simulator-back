import { InvalidLoanAmountError } from '@/use-cases/_errors/invalid-loan-amount-error'
import {
  INTEREST_RATES,
  MIN_LOAN_AMOUNT,
  MIN_MONTHLY_PAYMENT_RATE,
} from './contants'
import { formatCurrency } from './functions/format-currency'
import { InvalidMonthlyPaymentAmountError } from '@/use-cases/_errors/invalid-monthly-payment-amount-error'
import { InvalidInterestRateError } from '@/use-cases/_errors/invalid-interest-rate-error'

export class LoanValidator {
  static validateLoanAmount(loanAmount: number): void {
    if (loanAmount < MIN_LOAN_AMOUNT) {
      throw new InvalidLoanAmountError(
        `O valor do empréstimo deve ser de no mínimo ${formatCurrency(
          MIN_LOAN_AMOUNT
        )}`
      )
    }
  }

  static validateMonthlyPayment(
    loanAmount: number,
    monthlyPayment: number
  ): void {
    const minMonthlyPayment = loanAmount * MIN_MONTHLY_PAYMENT_RATE

    if (monthlyPayment < minMonthlyPayment) {
      throw new InvalidMonthlyPaymentAmountError(
        `O valor da parcela deve ser de no mínimo ${formatCurrency(
          minMonthlyPayment
        )}`
      )
    }

    if (monthlyPayment > loanAmount) {
      throw new InvalidMonthlyPaymentAmountError(
        'O valor da parcela não pode ser maior que o valor do empréstimo'
      )
    }
  }

  static validateInterestRate(uf: string, interestRate?: number): void {
    if (!interestRate || !INTEREST_RATES[uf]) {
      throw new InvalidInterestRateError(
        `Não é possível simular empréstimos para o estado ${uf}. Os estados disponíveis são: ${Object.keys(
          INTEREST_RATES
        ).join(', ')}`
      )
    }
  }
}
