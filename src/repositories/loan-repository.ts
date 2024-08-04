import { Loan, Prisma } from '@prisma/client'

export interface LoanRepository {
  create(data: Prisma.LoanCreateInput): Promise<Loan>
  getLoanById(id: string): Promise<Loan | null>
  getLoans(): Promise<Loan[]>
}
