/*
  Warnings:

  - You are about to drop the `Loan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Loan";

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "loan_amount" DOUBLE PRECISION NOT NULL,
    "monthly_payment" DOUBLE PRECISION NOT NULL,
    "number_of_installments" INTEGER NOT NULL,
    "total_payment" DOUBLE PRECISION NOT NULL,
    "interest_rate" DOUBLE PRECISION NOT NULL,
    "total_interest" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);
