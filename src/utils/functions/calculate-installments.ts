import { InstallmentProjection } from '@/types/installment-projection'
import { CustomError } from '@/use-cases/_errors/custom-error'
import dayjs from 'dayjs'

type CalculateInstallmentsParams = {
  loanAmount: number
  monthlyPayment: number
  interestRate: number
}

type CalculateInstallmentsReturn = {
  installments: InstallmentProjection[]
  totalInterest: number
}

export function calculateInstallments({
  interestRate,
  loanAmount,
  monthlyPayment,
}: CalculateInstallmentsParams): CalculateInstallmentsReturn {
  const installments: InstallmentProjection[] = []
  let outstandingBalance = loanAmount
  let totalInterest = 0

  for (let i = 0; ; i++) {
    const interest = outstandingBalance * interestRate
    const adjustedBalance = outstandingBalance + interest
    const dueDate = dayjs()
      .add(i + 1, 'month')
      .format('DD/MM/YYYY')

    let installmentAmount = monthlyPayment

    if (i > 0 && outstandingBalance < monthlyPayment) {
      installmentAmount = outstandingBalance + interest
    }

    installments.push({
      interest: parseFloat(interest.toFixed(2)),
      adjustedBalance: parseFloat(adjustedBalance.toFixed(2)),
      outstandingBalance: parseFloat(outstandingBalance.toFixed(2)),
      installmentAmount: parseFloat(installmentAmount.toFixed(2)),
      dueDate,
    })

    totalInterest += interest
    const newBalance = adjustedBalance - monthlyPayment

    if (newBalance === outstandingBalance) {
      throw new CustomError(
        'O valor da parcela é insuficiente para amortizar o saldo devedor'
      )
    }

    outstandingBalance = newBalance

    if (outstandingBalance <= 0) {
      break
    }
  }

  return {
    installments,
    totalInterest: parseFloat(totalInterest.toFixed(2)),
  }
}
