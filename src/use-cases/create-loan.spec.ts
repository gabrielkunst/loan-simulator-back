import { describe, expect, it } from 'vitest'
import { CreateLoanUseCase } from './create-loan'
import { InMemoryLoanRepository } from '@/repositories/in-memory/in-memory-loan-repository'
import { CustomError } from './_errors/custom-error'

type CreateSutReturn = {
  sut: CreateLoanUseCase
}

function createSut(): CreateSutReturn {
  const loanRepository = new InMemoryLoanRepository()
  const sut = new CreateLoanUseCase(loanRepository)

  return {
    sut,
  }
}

describe('Create Loan Use Case', () => {
  it('should create a loan', async () => {
    const { sut } = createSut()

    const loanData = {
      cpf: '097.870.590-46',
      birthdate: new Date('1990-01-01'),
      loanAmount: 50_000,
      monthlyPayment: 15_000,
      uf: 'MG',
      interestRate: 1,
      numberOfInstallments: 5,
      totalInterest: 1_545.53,
      totalPayment: 61_545.53,
    }

    const { loan } = await sut.execute(loanData)

    expect(loan.id).toBeTruthy()
    expect(loan.cpf).toBe(loanData.cpf)
    expect(loan.birthdate).toEqual(loanData.birthdate)
    expect(loan.loanAmount).toBe(loanData.loanAmount)
    expect(loan.monthlyPayment).toBe(loanData.monthlyPayment)
    expect(loan.uf).toBe(loanData.uf)
    expect(loan.interestRate).toBe(loanData.interestRate)
    expect(loan.numberOfInstallments).toBe(loanData.numberOfInstallments)
    expect(loan.totalInterest).toBe(loanData.totalInterest)
    expect(loan.totalPayment).toBe(loanData.totalPayment)
  })

  it("should throw an error if the monthly payment is greater than the loan's amount", async () => {
    const { sut } = createSut()

    const loanData = {
      cpf: '097.870.590-46',
      birthdate: new Date('1990-01-01'),
      loanAmount: 60_000,
      monthlyPayment: 80_000,
      uf: 'MG',
      interestRate: 1,
      numberOfInstallments: 5,
      totalInterest: 1_545.53,
      totalPayment: 61_545.53,
    }

    await expect(sut.execute(loanData)).rejects.toBeInstanceOf(CustomError)
  })

  it('should throw an error if loan amount is less than minimum loan amount', async () => {
    const { sut } = createSut()

    const loanData = {
      cpf: '097.870.590-46',
      birthdate: new Date('1990-01-01'),
      loanAmount: 10_000,
      monthlyPayment: 15_000,
      uf: 'MG',
      interestRate: 1,
      numberOfInstallments: 5,
      totalInterest: 1_545.53,
      totalPayment: 61_545.53,
    }

    await expect(sut.execute(loanData)).rejects.toBeInstanceOf(CustomError)
  })

  it("should throw an error if monthly payment is less than 1% of the loan's amount", async () => {
    const { sut } = createSut()

    const loanData = {
      cpf: '097.870.590-46',
      birthdate: new Date('1990-01-01'),
      loanAmount: 50_000,
      monthlyPayment: 400,
      uf: 'MG',
      interestRate: 1,
      numberOfInstallments: 5,
      totalInterest: 1_545.53,
      totalPayment: 61_545.53,
    }

    await expect(sut.execute(loanData)).rejects.toBeInstanceOf(CustomError)
  })

  it("should throw an error if interest rate is not available for the provided state's UF", async () => {
    const { sut } = createSut()

    const loanData = {
      cpf: '097.870.590-46',
      birthdate: new Date('1990-01-01'),
      loanAmount: 50_000,
      monthlyPayment: 15_000,
      uf: 'PR',
      interestRate: 1,
      numberOfInstallments: 5,
      totalInterest: 1_545.53,
      totalPayment: 61_545.53,
    }

    await expect(sut.execute(loanData)).rejects.toBeInstanceOf(CustomError)
  })
})
