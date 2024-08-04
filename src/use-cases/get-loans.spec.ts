import { describe, expect, it } from 'vitest'
import { GetLoansUseCase } from './get-loans'
import { LoanRepository } from '@/repositories/loan-repository'
import { InMemoryLoanRepository } from '@/repositories/in-memory/in-memory-loan-repository'

type CreateSutRetun = {
  sut: GetLoansUseCase
  loansRepository: LoanRepository
}

function createSut(): CreateSutRetun {
  const loansRepository = new InMemoryLoanRepository()
  const sut = new GetLoansUseCase(loansRepository)

  return {
    sut,
    loansRepository,
  }
}

describe('Get Loans Use Case', () => {
  it('should get all loans', async () => {
    const { sut, loansRepository } = createSut()

    const loan1 = await loansRepository.create({
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

    const loan2 = await loansRepository.create({
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

    const { loans } = await sut.execute()

    expect(loans).toHaveLength(2)
    expect(loans[0].id).toBe(loan1.id)
    expect(loans[1].id).toBe(loan2.id)
  })

  it('should return an empty array if there are no loans', async () => {
    const { sut } = createSut()

    const { loans } = await sut.execute()

    expect(loans).toHaveLength(0)
  })
})
