import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calculateInstallments } from './calculate-installments'

describe('Calculate Installments Function', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    vi.setSystemTime(new Date(2021, 7, 20, 0, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return the installments correctly', () => {
    const simulationData = {
      loanAmount: 60_000,
      monthlyPayment: 15_000,
      interestRate: 0.01,
    }

    const { installments, totalInterest } =
      calculateInstallments(simulationData)

    expect(totalInterest).toBe(1_545.53)
    expect(installments).toEqual([
      {
        outstandingBalance: 60_000,
        interest: 600,
        adjustedBalance: 60_600,
        installmentAmount: 15_000,
        dueDate: '20/09/2021',
      },
      {
        outstandingBalance: 45_600,
        interest: 456,
        adjustedBalance: 46_056,
        installmentAmount: 15_000,
        dueDate: '20/10/2021',
      },
      {
        outstandingBalance: 31_056,
        interest: 310.56,
        adjustedBalance: 31_366.56,
        installmentAmount: 15_000,
        dueDate: '20/11/2021',
      },
      {
        outstandingBalance: 16_366.56,
        interest: 163.67,
        adjustedBalance: 16_530.23,
        installmentAmount: 15_000,
        dueDate: '20/12/2021',
      },
      {
        outstandingBalance: 1_530.23,
        interest: 15.3,
        adjustedBalance: 1_545.53,
        installmentAmount: 1_545.53,
        dueDate: '20/01/2022',
      },
    ])
  })

  it('should handle case where loan amount is the same as monthly payment', () => {
    const simulationData = {
      loanAmount: 60_000,
      monthlyPayment: 60_000,
      interestRate: 0.01,
    }

    const { installments, totalInterest } =
      calculateInstallments(simulationData)

    expect(totalInterest).toBe(606)
    expect(installments).toEqual([
      {
        outstandingBalance: 60_000,
        interest: 600,
        adjustedBalance: 60_600,
        installmentAmount: 60_000,
        dueDate: '20/09/2021',
      },
      {
        outstandingBalance: 600,
        interest: 6,
        adjustedBalance: 606,
        installmentAmount: 606,
        dueDate: '20/10/2021',
      },
    ])
  })

  it('should handle cases where interest is 0', () => {
    const simulationData = {
      loanAmount: 60_000,
      monthlyPayment: 15_000,
      interestRate: 0,
    }

    const { installments, totalInterest } =
      calculateInstallments(simulationData)

    expect(totalInterest).toBe(0)
    expect(installments).toEqual([
      {
        outstandingBalance: 60_000,
        interest: 0,
        adjustedBalance: 60_000,
        installmentAmount: 15_000,
        dueDate: '20/09/2021',
      },
      {
        outstandingBalance: 45_000,
        interest: 0,
        adjustedBalance: 45_000,
        installmentAmount: 15_000,
        dueDate: '20/10/2021',
      },
      {
        outstandingBalance: 30_000,
        interest: 0,
        adjustedBalance: 30_000,
        installmentAmount: 15_000,
        dueDate: '20/11/2021',
      },
      {
        outstandingBalance: 15_000,
        interest: 0,
        adjustedBalance: 15_000,
        installmentAmount: 15_000,
        dueDate: '20/12/2021',
      },
    ])
  })
})
