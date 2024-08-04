import { describe, expect, it } from 'vitest'
import { GetLoanByIdUseCase } from './get-loan-by-id'
import { LoanRepository } from '@/repositories/loan-repository'
import { InMemoryLoanRepository } from '@/repositories/in-memory/in-memory-loan-repository'
import { CustomError } from './_errors/custom-error'

type CreateSutRetun = {
  sut: GetLoanByIdUseCase
  loanRepository: LoanRepository
}

function createSut(): CreateSutRetun {
  const loanRepository = new InMemoryLoanRepository()
  const sut = new GetLoanByIdUseCase(loanRepository)

  return {
    sut,
    loanRepository,
  }
}

describe('Get Loan By Id Use Case', () => {
  it('should get a loan by id', async () => {
    const { sut, loanRepository } = createSut()

    const loan = await loanRepository.create({
      birthdate: new Date('1990-01-01'),
      cpf: '097.870.590-46',
      interestRate: 1,
      loanAmount: 50_000,
      monthlyPayment: 15_000,
      numberOfInstallments: 5,
      totalInterest: 1_545.53,
      totalPayment: 61_545.53,
      uf: 'MG',
    })

    const { loan: returnedLoan } = await sut.execute(loan.id)

    expect(returnedLoan.id).toBe(loan.id)
    expect(returnedLoan.cpf).toBe(loan.cpf)
    expect(returnedLoan.birthdate).toEqual(loan.birthdate)
    expect(returnedLoan.interestRate).toBe(loan.interestRate)
    expect(returnedLoan.loanAmount).toBe(loan.loanAmount)
    expect(returnedLoan.monthlyPayment).toBe(loan.monthlyPayment)
    expect(returnedLoan.numberOfInstallments).toBe(loan.numberOfInstallments)
    expect(returnedLoan.totalInterest).toBe(loan.totalInterest)
    expect(returnedLoan.totalPayment).toBe(loan.totalPayment)
    expect(returnedLoan.uf).toBe(loan.uf)
  })

  it('should throw an error if the loan is not found', async () => {
    const { sut } = createSut()

    await expect(sut.execute('invalid-id')).rejects.toThrow(CustomError)
  })
})
