import { Loan, Prisma } from '@prisma/client'
import { LoanRepository } from '../loan-repository'
import { randomUUID } from 'crypto'

export class InMemoryLoanRepository implements LoanRepository {
  public loans: Loan[] = []

  async create(data: Prisma.LoanCreateInput) {
    const loan: Loan = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
      birthdate: new Date(data.birthdate),
    }

    this.loans.push(loan)

    return loan
  }

  async getLoanById(id: string) {
    const loan = this.loans.find((loan) => loan.id === id)

    if (!loan) {
      return null
    }

    return loan
  }

  async getLoans() {
    return this.loans
  }
}
