document.addEventListener('DOMContentLoaded', function() {
  const affordabilityComputeMode = document.getElementById('affordability_compute_mode');
  const affordabilityPricePeriod = document.getElementById('affordability_price_period');
  const affordabilityRepPeriod = document.getElementById('affordability_rep_period');
  let userInput = document.getElementById('user_input');
  const resultLabel = document.querySelector('.result_label');
  const result = document.querySelector('.result');
  const principalAndInterest = document.querySelector('.principal_and_interest');
  const insurance = document.querySelector('.insurance');
  const monthlyAmortization = document.querySelector('.monthly_amortization');
  const hiddenDivComputation = document.querySelector('.hidden_div_computation');
  const propVal = document.querySelector('.prop_val');
  const propVal2 = document.querySelector('.prop_val_2');
  const calculateAffordabilityBtn = document.querySelector('.calculate_affordability');
  const estEquity = document.querySelector('.est_equity');
  const gmi = document.querySelector('.gmi');




  // Function to clear values inside hidden_div_computation
function clearComputationValues() {
  let resultElements = document.querySelectorAll('.result, .principal_and_interest, .insurance, .monthly_amortization, .est_equity, .gmi');
  resultElements.forEach(function (element) {
      element.textContent = '';
  });
}

affordabilityComputeMode.addEventListener('change', clearComputationValues);
affordabilityPricePeriod.addEventListener('change', clearComputationValues);
affordabilityRepPeriod.addEventListener('change', clearComputationValues);

// Listen for keyup event on #user_input
userInput.addEventListener('keyup', clearComputationValues);


  function updateLabels(newLabel, newTextResult) {
    resultLabel.closest('.form-group').querySelector('.result_label').textContent = newTextResult;
    userInput.closest('.form-group').querySelector('label[for="inp"]').textContent = newLabel;
  }

  function showAlert(message) {
    alert(message);
  }

  function calculateMonthlyAmortization(loanDesired, interestRate, loanTermMonths) {
    const monthlyPayment = loanDesired * interestRate / (1 - Math.pow(1 + interestRate, -loanTermMonths));
    const insuranceValue = loanDesired * 0.0002250427;
    return monthlyPayment + insuranceValue;
  }

  function calculateAffordability(annualInterestRate, loanTermYears) {
    const pricePeriod = parseFloat(affordabilityPricePeriod.value);
    let monthlyInterestRate = (annualInterestRate / 100) / 12;
    let loanTermMonths = loanTermYears * 12;
    let monthlyPaymentPercentage =(pricePeriod === 5.75) ? 30 : 35; // 35%



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
    const computedValue = presentValue * (monthlyPaymentPercentage / 100) * ((1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths)) / monthlyInterestRate);
      console.log('newPresnetVal',presentValue);
      console.log('ComputedVal',computedValue);
    // const insuranceValue = (presentValue / 1000) * 0.2250427;
    // const monthlyAmortizationValue = (presentValue * (monthlyPaymentPercentage / 100)) + insuranceValue;

    // console.log('insuVal ',insuranceValue,monthlyAmortizationValue)
    let fixedPresentValue = presentValue * (monthlyPaymentPercentage / 100) * ((1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths)) / monthlyInterestRate);
    fixedPresentValue = Math.min(fixedPresentValue, 6000000);
    // fixedPresentValue: 6000006.263413198
    let principalAndInterest = (presentValue * (monthlyPaymentPercentage / 100))
     let insuranceValue = (presentValue / 1000) * 0.2250427;
    let monthlyAmortization = principalAndInterest + insuranceValue;
    // Return the computed values
    return {
      presentValue,
      monthlyAmortization,
      insuranceValue,
      fixedPresentValue
    };
  }

  function displayValues(fixedPresentValue, principalAndInterestValue, insuranceValue, monthlyAmortizationValue) {
    result.textContent = formatCurrency(fixedPresentValue);
    principalAndInterest.textContent = formatCurrency(principalAndInterestValue);
    insurance.textContent = formatCurrency(insuranceValue);
    monthlyAmortization.textContent = formatCurrency(monthlyAmortizationValue);
    console.log("from dispV fixedPresentValue",fixedPresentValue);
    console.log("from dispV principalAndInterestValue", principalAndInterestValue);
    console.log("from dispV insuranceValue",insuranceValue);
    console.log("from dispV monthlyAmortizationValue",monthlyAmortizationValue);

  }

  function formatCurrency(value) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol'
    });
  }

  function handleComputeModeChange() {
    const val = affordabilityComputeMode.value;
    let newLabel = '';
    let newTextResult = '';

    switch (val) {
      case '1':
        newLabel = 'Desired Loan Amount:';
        newTextResult = 'The income required for your desired loan amount is approximately:';
        break;
      case '2':
        newLabel = 'Gross Monthly Income:';
        newTextResult = 'Based on your Gross Monthly Income, you can approximately loan:';
        break;
      case '3':
        newLabel = 'Estimated Value of Property:';
        newTextResult = 'Based on the appraised value of the property, you can approximately loan:';
        break;
      default:
        newLabel = 'Enter Amount:';
        break;
    }

    updateLabels(newLabel, newTextResult);
  }

  function handleCalculateButtonClick() {
    const valMode = affordabilityComputeMode.value;
    const pricePeriod = parseFloat(affordabilityPricePeriod.value);
    const loanTermYears = parseInt(affordabilityRepPeriod.value);
    const loanDesired = parseFloat(userInput.value);

    hiddenDivComputation.classList.remove('hide');

    if (userInput.value === '') {
      showAlert('Please enter an amount.');
      return;
    }

    if (loanDesired < 5000) {
      showAlert('Minimum amount must be 5000.');
      return;
    }

    if (loanDesired > 6000000) {
      showAlert('Please enter an amount lower than 6,000,000.');
      return;
    }

    if (affordabilityComputeMode.value.trim() === '') {
      showAlert('Please select what you want to compute.');
      return;
    }

    if (affordabilityRepPeriod.value.trim() === '') {
      showAlert('Please select preferred pricing period.');
      return;
    }

    if (valMode === '1') {
      const interestRate = (pricePeriod / 100) / 12;
      const loanTermMonths = 12 * loanTermYears;
      const debtToIncomeRatio = (pricePeriod === 5.75) ? 0.30 : 0.35;
      const requiredIncome = loanDesired / ((((1 + interestRate) ** loanTermMonths) - 1) / (interestRate * (1 + interestRate) ** loanTermMonths)) / debtToIncomeRatio;
      const principalAndInterestValue = requiredIncome * debtToIncomeRatio;
      const insuranceValue = loanDesired * 0.0002250427;
      const monthlyAmortizationValue = calculateMonthlyAmortization(loanDesired, interestRate, loanTermMonths);

      displayValues(requiredIncome, principalAndInterestValue, insuranceValue, monthlyAmortizationValue);

      hiddenDivComputation.classList.remove('hide');
      propVal.classList.add('hide');
      propVal2.classList.add('hide');
    } else if (valMode === '2') {
      // Handle valMode 2 calculations
      const annualInterestRate = parseFloat(affordabilityPricePeriod.value);
      const monthlyInterestRate = (annualInterestRate / 100) / 12;
      const loanTermMonths = loanTermYears * 12;
      const monthlyPaymentPercentage = (pricePeriod === 5.75) ? 30 : 35; // 35%

      let fixedPresentValue = userInput.value * (monthlyPaymentPercentage / 100) * ((1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths)) / monthlyInterestRate);
      // fixedPresentValue = Math.min(fixedPresentValue, 6000000);

      let insuranceValue = (fixedPresentValue / 1000) * 0.2250427;
      let monthlyAmortizationValue = (userInput.value * (monthlyPaymentPercentage / 100)) + insuranceValue;
 
      if (fixedPresentValue >= 6000000) {
        // Perform the additional calculation only when fixedPresentValue is >= 6,000,000
        const calcResult = calculateAffordability(annualInterestRate, loanTermYears);
        // const newInsuranceValue = (fixedPresentValue / 1000) * 0.2250427;
        // console.log("this is result >= 6M: ", result);
        // let insuranceValue2 = (calcResult.presentValue / 1000) * 0.2250427;
        // let monthlyAmortizationValue = (calcResult.presentValue * (monthlyPaymentPercentage / 100)) + insuranceValue;

        
   
        let principalAndInterest = (calcResult.presentValue * (monthlyPaymentPercentage / 100))

        let insuranceValue2 = (calcResult.fixedPresentValue / 1000) * 0.2250427;
        let monthlyAmortization = principalAndInterest + insuranceValue2;
 
        displayValues(calcResult.fixedPresentValue, principalAndInterest ,insuranceValue2, monthlyAmortization);
      } else {
        // Update the UI with the values based on fixedPresentValue
        displayValues(fixedPresentValue, (userInput.value * (monthlyPaymentPercentage / 100)), insuranceValue, monthlyAmortizationValue);
      }

      hiddenDivComputation.classList.remove('hide');
      propVal.classList.add('hide');
      propVal2.classList.add('hide');
    } else if (valMode === '3') {
      // Handle valMode 3 calculations
      const valueOfProperty = parseFloat(userInput.value);
      let estVal, estimatedEquity, insuranceValue, principalAndInterestValue, grossMonthly;

      if (valueOfProperty <= 2000000) {
        estVal = valueOfProperty * 0.95;
        estimatedEquity = valueOfProperty * 0.05;
      } else {
        estVal = valueOfProperty * 0.9;
        estimatedEquity = valueOfProperty * 0.1;
      }

      insuranceValue = estVal * 0.0002250427;
      const interestRate = (pricePeriod / 100) / 12;
      const loanTermMonths = loanTermYears * 12;
      const principalAndInterestFactor = Math.pow(1 + interestRate, loanTermMonths) - 1;
      const denominator = interestRate * Math.pow(1 + interestRate, loanTermMonths);
      const allowableAmort = (pricePeriod === 5.75) ? 0.30 : 0.35; // 35%

      grossMonthly = estVal / (principalAndInterestFactor / denominator) / allowableAmort;
      principalAndInterestValue = grossMonthly * allowableAmort;

      result.textContent = formatCurrency(Math.round(estVal - 0.10));
      principalAndInterest.textContent = formatCurrency(principalAndInterestValue);
      insurance.textContent = insuranceValue ? formatCurrency(insuranceValue) : '';
      monthlyAmortization.textContent = grossMonthly ? formatCurrency(grossMonthly) : '';
      estEquity.textContent = formatCurrency(estimatedEquity);
      gmi.textContent = formatCurrency(grossMonthly);

      propVal.classList.remove('hide');
      propVal2.classList.remove('hide');
    }
  }

  affordabilityComputeMode.addEventListener('change', handleComputeModeChange);
  calculateAffordabilityBtn.addEventListener('click', handleCalculateButtonClick);
});
