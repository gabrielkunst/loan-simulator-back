import { describe, expect, it } from 'vitest'
import { SimulateLoanUseCase } from './simulate-loan'
import { INTEREST_RATES } from '@/utils/contants'
import { InvalidLoanAmountError } from './_errors/invalid-loan-amount-error'
import { InvalidMonthlyPaymentAmountError } from './_errors/invalid-monthly-payment-amount-error'
import { InvalidInterestRateError } from './_errors/invalid-interest-rate-error'

type CreateSutReturn = {
  sut: SimulateLoanUseCase
}

function createSut(): CreateSutReturn {
  const sut = new SimulateLoanUseCase()

  return {
    sut,
  }
}

describe('Simulate Loan Use Case', () => {
  it('should throw an error if the loan amount is less than the minimum', () => {
    const { sut } = createSut()

    const simulationData = {
      cpf: '117.817.210-41',
      uf: 'MG',
      birthdate: '10/10/1986',
      loanAmount: 49_999,
      monthlyPayment: 2_000,
    }

    expect(() => sut.execute(simulationData)).toThrowError(
      InvalidLoanAmountError
    )
  })

  it('should throw an error if the monthly payment is less than the minimum', () => {
    const { sut } = createSut()

    const simulationData = {
      cpf: '117.817.210-41',
      uf: 'MG',
      birthdate: '10/10/1986',
      loanAmount: 50_000,
      monthlyPayment: 499,
    }

    expect(() => sut.execute(simulationData)).toThrowError(
      InvalidMonthlyPaymentAmountError
    )
  })

  it("should throw an error if the interest rate for the provided 'uf' is not available", () => {
    const { sut } = createSut()

    const simulationData = {
      cpf: '117.817.210-41',
      uf: 'any_uf',
      birthdate: '10/10/1986',
      loanAmount: 50_000,
      monthlyPayment: 2_000,
    }

    expect(() => sut.execute(simulationData)).toThrowError(
      InvalidInterestRateError
    )
  })

  it('should be able to simulate a loan', () => {
    const { sut } = createSut()

    const simulationData = {
      cpf: '117.817.210-41',
      uf: 'MG',
      birthdate: '10/10/1986',
      loanAmount: 60_000,
      monthlyPayment: 15_000,
    }

    const {
      requestedAmount,
      interestRate,
      monthlyPayment,
      numberOfInstallments,
      totalInterest,
      totalPayment,
    } = sut.execute(simulationData)

    expect(requestedAmount).toBe(simulationData.loanAmount)
    expect(interestRate).toBe(INTEREST_RATES[simulationData.uf])
    expect(monthlyPayment).toBe(simulationData.monthlyPayment)
    expect(numberOfInstallments).toBe(5)
    expect(totalInterest).toBeCloseTo(1_545.53, 2)
    expect(totalPayment).toBeCloseTo(61_545.53, 2)
  })
})
