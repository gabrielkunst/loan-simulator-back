export class InvalidMonthlyPaymentAmountError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidMonthlyPaymentAmountError'
  }
}
