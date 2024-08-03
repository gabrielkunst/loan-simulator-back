-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "loan_amount" DOUBLE PRECISION NOT NULL,
    "monthly_payment" DOUBLE PRECISION NOT NULL,
    "number_of_installments" INTEGER NOT NULL,
    "total_payment" DOUBLE PRECISION NOT NULL,
    "total_interest" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);
