import { Prisma } from '@prisma/client'
import { LoanRepository } from '../loan-repository'
import { prisma } from '@/lib/prisma'

export class PrismaLoanRepository implements LoanRepository {
  async create(data: Prisma.LoanCreateInput) {
    return await prisma.loan.create({
      data: {
        ...data,
        birthdate: new Date(data.birthdate),
      },
    })
  }

  async getLoan(loanId: string) {
    return await prisma.loan.findUnique({
      where: {
        id: loanId,
      },
    })
  }
}
