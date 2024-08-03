import { Loan, Prisma } from '@prisma/client'

export interface LoanRepository {
  create(data: Prisma.LoanCreateInput): Promise<Loan>
  getLoan(loanId: string): Promise<Loan | null>
}
