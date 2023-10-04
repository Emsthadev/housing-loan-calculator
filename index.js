document.addEventListener('DOMContentLoaded', function() {
	let affordabilityComputeMode = document.getElementById('affordability_compute_mode');
	let affordabilityPricePeriod = document.getElementById('affordability_price_period');
	let affordabilityRepPeriod = document.getElementById('affordability_rep_period');
	let userInput = document.getElementById('user_input');
	let resultLabel = document.querySelector('.result_label');
	let result = document.querySelector('.result');
	let principalAndInterest = document.querySelector('.principal_and_interest');
	let insurance = document.querySelector('.insurance');
	let monthlyAmortization = document.querySelector('.monthly_amortization');
	let hiddenDivComputation = document.querySelector('.hidden_div_computation');
	let propVal = document.querySelector('.prop_val');
	let propVal2 = document.querySelector('.prop_val_2');

	let calculateAffordabilityBtn = document.querySelector('.calculate_affordability');
	let estEquity = document.querySelector('.est_equity');
	let gmi = document.querySelector('.gmi');

        // Function to clear result fields
        function clearResults() {
            result.textContent = '';
            principalAndInterest.textContent = '';
            insurance.textContent = '';
            monthlyAmortization.textContent = '';
            estEquity.textContent = '';
            gmi.textContent = '';
        }
    
        // Event listener for the 'compute mode' dropdown
        affordabilityComputeMode.addEventListener('change', function() {
            clearResults(); // Clear results when the compute mode changes
    
            // Rest of your code...
        });
    
        // Event listener for the 'Calculate' button
    
    
        // Event listener for changes in .result element
        result.addEventListener('keyup', function() {
            clearResults(); // Clear results when .result element changes
            console.log(("clearRes",clearResults()));
            // Rest of your code...
        });

	// Event listener for the 'compute mode' dropdown
	affordabilityComputeMode.addEventListener('change', function() {
		let val = this.value;
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

		resultLabel.closest('.form-group').querySelector('.result_label').textContent = newTextResult;
		userInput.closest('.form-group').querySelector('label[for="inp"]').textContent = newLabel;
	});

	// Event listener for the 'Calculate' button
	calculateAffordabilityBtn.addEventListener('click', function() {
        clearResults();
		let valMode = affordabilityComputeMode.value;
		let pricePeriod = parseFloat(affordabilityPricePeriod.value);
		let loanTermYears = parseInt(affordabilityRepPeriod.value);
		let loanDesired = parseFloat(userInput.value);

		hiddenDivComputation.classList.remove('hide');
		// Validations
		if (userInput.value === '') {
			alert('Please enter an amount.');
			return;
		}

		//  is less than 5000
		if (parseFloat(userInput.value) < 5000) {
			alert('Minimum amount must be 5000.');
			return;
		}

		//  is greater than 6,000,000
		if (parseFloat(userInput.value) > 6000000) {
			alert('Please enter an amount lower than 6,000,000.');
			return;
		}

		// affordability_compute_mode is empty
		if (affordabilityComputeMode.value.trim() === '') {
			alert('Please select what you want to compute.');
			return;
		}

		// affordability_rep_period is empty
		if (affordabilityRepPeriod.value.trim() === '') {
			alert('Please select preferred pricing period.');
			return;
		}

		if (valMode === '1') {
			console.log(pricePeriod);
			let interestRate = (pricePeriod / 100) / 12;
			let loanTermMonths = 12 * loanTermYears;
			//condition for 1 year 5.75% pricing period
			let debtToIncomeRatio = (pricePeriod === 5.75) ? 0.30 : 0.35;
			let monthlyPayment = loanDesired * interestRate / (1 - Math.pow(1 + interestRate, -loanTermMonths));
			let requiredIncome = loanDesired / ((((1 + interestRate) ** loanTermMonths) - 1) / (interestRate * (1 + interestRate) ** loanTermMonths)) / debtToIncomeRatio;
			let principalAndInterestValue = requiredIncome * debtToIncomeRatio;
			let insuranceValue = loanDesired * 0.0002250427;
			let monthlyAmortizationValue = monthlyPayment + insuranceValue;



			result.textContent = Math.round(requiredIncome.toFixed(2)).toLocaleString('en-US', {
				style: 'currency',
				currency: 'PHP',
				currencyDisplay: 'symbol'
			});

			principalAndInterest.textContent = principalAndInterestValue.toFixed(2).toLocaleString('en-US', {
				style: 'currency',
				currency: 'PHP',
				currencyDisplay: 'symbol'
			});

			insurance.textContent = insuranceValue.toFixed(2).toLocaleString('en-US', {
				style: 'currency',
				currency: 'PHP',
				currencyDisplay: 'symbol'
			});

			monthlyAmortization.textContent = monthlyAmortizationValue.toFixed(2).toLocaleString('en-US', {
				style: 'currency',
				currency: 'PHP',
				currencyDisplay: 'symbol'
			});

			hiddenDivComputation.classList.remove('hide');
			propVal.classList.add('hide');
			propVal2.classList.add('hide');
		}  if (valMode === '2') {
			// Handle valMode 2 calculations
			let annualInterestRate = parseFloat(affordabilityPricePeriod.value);
			let monthlyInterestRate = (annualInterestRate / 100) / 12;
			let loanTermMonths = loanTermYears * 12;
			let monthlyPaymentPercentage = (pricePeriod === 5.75) ? 30 : 35; // 35%

			if (userInput.value >= 105552 && pricePeriod != 5.75) {
				// If userInput exceeds the maximum limit, set it to the maximum value
				let fixedPresentValue = 105552 * (monthlyPaymentPercentage / 100) * ((1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths)) / monthlyInterestRate);
				fixedPresentValue = Math.min(fixedPresentValue, 6000000);

				let insuranceValue = (fixedPresentValue / 1000) * 0.2250427;
				let monthlyAmortizationValue = (105552 * (monthlyPaymentPercentage / 100)) + insuranceValue;

				result.textContent = Math.round(fixedPresentValue.toFixed(2)).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
				});

				principalAndInterest.textContent = (105552 * (monthlyPaymentPercentage / 100)).toFixed(2).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
				});

				insurance.textContent = insuranceValue.toFixed(2).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
				});

				monthlyAmortization.textContent = monthlyAmortizationValue.toFixed(2).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
				});

			} 
            if(userInput.value < 105552  && pricePeriod != 5.75) {
				let presentValue = userInput.value * (monthlyPaymentPercentage / 100) * ((1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths)) / monthlyInterestRate);
				presentValue = Math.min(presentValue, 6000000);

				let insuranceValue = (presentValue / 1000) * 0.2250427;
				let monthlyAmortizationValue = (userInput.value * (monthlyPaymentPercentage / 100)) + insuranceValue;

				result.textContent = Math.round(presentValue.toFixed(2)).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
				});

				principalAndInterest.textContent = (userInput.value * (monthlyPaymentPercentage / 100)).toFixed(2).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
				});

				insurance.textContent = insuranceValue.toFixed(2).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
				});

				monthlyAmortization.textContent = monthlyAmortizationValue.toFixed(2).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
				});
			}

            if(userInput.value >= 116715.5615 && pricePeriod == 5.75){
            
                let presentValue = 116715.5615 * (monthlyPaymentPercentage / 100) * ((1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths)) / monthlyInterestRate);
				presentValue = Math.min(presentValue, 6000000);

				let insuranceValue = (presentValue / 1000) * 0.2250427;
				let monthlyAmortizationValue = (116715.5615 * (monthlyPaymentPercentage / 100)) + insuranceValue;

				result.textContent = Math.round(presentValue.toFixed(2)).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
				});

				principalAndInterest.textContent = (116715.5615 * (monthlyPaymentPercentage / 100)).toFixed(2).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
				});

				insurance.textContent = insuranceValue.toFixed(2).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
				});

				monthlyAmortization.textContent = monthlyAmortizationValue.toFixed(2).toLocaleString('en-US', {
					style: 'currency',
					currency: 'PHP',
					currencyDisplay: 'symbol'
                });
            }
            else{
                console.log('test',monthlyPaymentPercentage);
            let presentValue = userInput.value * (monthlyPaymentPercentage / 100) * ((1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths)) / monthlyInterestRate);
            presentValue = Math.min(presentValue, 6000000);

            let insuranceValue = (presentValue / 1000) * 0.2250427;
            let monthlyAmortizationValue = (userInput.value * (monthlyPaymentPercentage / 100)) + insuranceValue;

            result.textContent = Math.round(presentValue.toFixed(2)).toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP',
                currencyDisplay: 'symbol'
            });

            principalAndInterest.textContent = (userInput.value * (monthlyPaymentPercentage / 100)).toFixed(2).toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP',
                currencyDisplay: 'symbol'
            });

            insurance.textContent = insuranceValue.toFixed(2).toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP',
                currencyDisplay: 'symbol'
            });

            monthlyAmortization.textContent = monthlyAmortizationValue.toFixed(2).toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP',
                currencyDisplay: 'symbol'
            });

        }

      
			hiddenDivComputation.classList.remove('hide');
			propVal.classList.add('hide');
			propVal2.classList.add('hide');
        

		} if (valMode === '3') {
			// Handle valMode 3 calculations
			let valueOfProperty = parseFloat(userInput.value);
			let estVal, estimatedEquity, insuranceValue, principalAndInterestValue, grossMonthly;


			if (valueOfProperty <= 2000000) {
				estVal = valueOfProperty * 0.95;
				estimatedEquity = valueOfProperty * 0.05;

				insuranceValue = estVal * 0.0002250427;

				let interestRate = (pricePeriod / 100) / 12;
				let loanTermMonths = loanTermYears * 12;
				let principalAndInterestFactor = Math.pow(1 + interestRate, loanTermMonths) - 1;
				let denominator = interestRate * Math.pow(1 + interestRate, loanTermMonths);
				let allowableAmort = (pricePeriod === 5.75) ? .30 : .35; // 35%

				grossMonthly = estVal / (principalAndInterestFactor / denominator) / allowableAmort;
				principalAndInterestValue = grossMonthly * allowableAmort;
			} else {
				estVal = valueOfProperty * 0.9;
				estimatedEquity = valueOfProperty * 0.1;

				insuranceValue = estVal * 0.0002250427;

				let interestRate = (pricePeriod / 100) / 12;
				let loanTermMonths = loanTermYears * 12;
				let principalAndInterestFactor = Math.pow(1 + interestRate, loanTermMonths) - 1;
				let denominator = interestRate * Math.pow(1 + interestRate, loanTermMonths);
				let allowableAmort = (pricePeriod === 5.75) ? .30 : .35; // 35%

				grossMonthly = estVal / (principalAndInterestFactor / denominator) / allowableAmort;
				principalAndInterestValue = grossMonthly * allowableAmort;

			}

			result.textContent = Math.round((estVal - 0.10).toFixed(2)).toLocaleString('en-US', {
				style: 'currency',
				currency: 'PHP',
				currencyDisplay: 'symbol'
			});

			principalAndInterest.textContent = principalAndInterestValue.toFixed(2).toLocaleString('en-US', {
				style: 'currency',
				currency: 'PHP',
				currencyDisplay: 'symbol'
			});

			insurance.textContent = insuranceValue ? insuranceValue.toFixed(2).toLocaleString('en-US', {
				style: 'currency',
				currency: 'PHP',
				currencyDisplay: 'symbol'
			}) : '';

			monthlyAmortization.textContent = grossMonthly ? grossMonthly.toFixed(2).toLocaleString('en-US', {
				style: 'currency',
				currency: 'PHP',
				currencyDisplay: 'symbol'
			}) : '';

			estEquity.textContent = estimatedEquity.toFixed(2).toLocaleString('en-US', {
				style: 'currency',
				currency: 'PHP',
				currencyDisplay: 'symbol'
			});

			gmi.textContent = grossMonthly.toFixed(2).toLocaleString('en-US', {
				style: 'currency',
				currency: 'PHP',
				currencyDisplay: 'symbol'
			});

			propVal.classList.remove('hide');
			propVal2.classList.remove('hide');
		}
	});
});