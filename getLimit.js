function displayIncomeLimit(res) {
    console.log(res)
}

function calculateAffordability(affordabilityPricePeriod, affordabilityRepPeriod) {
  const annualInterestRate = parseFloat(affordabilityPricePeriod);
  const monthlyInterestRate = (annualInterestRate / 100) / 12;
  const loanTermYears = parseFloat(affordabilityRepPeriod);
  const loanTermMonths = loanTermYears * 12;
  const monthlyPaymentPercentage = 35; // 35%

  let lowerBound = 0;
  let upperBound = 100000000; // Set a large upper bound
  let presentValue = 0;

  // Use a binary search-like loop to find the presentValue
  while (upperBound - lowerBound > 1) {
    presentValue = (lowerBound + upperBound) / 2;

    const computedValue = presentValue * (monthlyPaymentPercentage / 100) * ((1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths)) / monthlyInterestRate);
    if (computedValue > 6000000) {
      upperBound = presentValue;
    } else {
      lowerBound = presentValue;
    }
  }

  const insuranceValue = (presentValue / 1000) * 0.2250427;
  const monthlyAmortizationValue = (presentValue * (monthlyPaymentPercentage / 100)) + insuranceValue;

  displayIncomeLimit(presentValue, (presentValue * (monthlyPaymentPercentage / 100)), insuranceValue, monthlyAmortizationValue);
}

// Usage example with your provided parameters
calculateAffordability(9.75, 28);