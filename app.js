// Stock Average Cost Calculator - Simplified and Fixed
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Stock Calculator...');
    
    // Get all required elements
    const form = document.getElementById('calculatorForm');
    const clearBtn = document.getElementById('clearBtn');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const resultsSection = document.getElementById('resultsSection');
    
    // Input elements
    const inputs = {
        currentShares: document.getElementById('currentShares'),
        currentAverage: document.getElementById('currentAverage'),
        buyPrice: document.getElementById('buyPrice'),
        targetAverage: document.getElementById('targetAverage')
    };
    
    // Result elements
    const results = {
        mainResult: document.getElementById('mainResult'),
        sharesToBuy: document.getElementById('sharesToBuy'),
        totalSharesAfter: document.getElementById('totalSharesAfter'),
        totalCostAfter: document.getElementById('totalCostAfter'),
        newAverageAfter: document.getElementById('newAverageAfter'),
        multiTargetBody: document.getElementById('multiTargetBody')
    };
    
    // Check if all elements exist
    const missingElements = [];
    Object.entries(inputs).forEach(([key, element]) => {
        if (!element) missingElements.push(`input: ${key}`);
    });
    Object.entries(results).forEach(([key, element]) => {
        if (!element) missingElements.push(`result: ${key}`);
    });
    
    if (missingElements.length > 0) {
        console.error('Missing elements:', missingElements);
        return;
    }
    
    console.log('All elements found successfully');

    // Utility functions
    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }
    
    function formatShares(value) {
        return Math.floor(value).toLocaleString();
    }

    function showError(message) {
        console.log('Showing error:', message);
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
        resultsSection.classList.add('hidden');
    }
    
    function hideError() {
        errorMessage.classList.add('hidden');
    }
    
    function showResults() {
        console.log('Showing results...');
        hideError();
        resultsSection.classList.remove('hidden');
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    function getValues() {
        return {
            currentShares: parseFloat(inputs.currentShares.value) || 0,
            currentAverage: parseFloat(inputs.currentAverage.value) || 0,
            buyPrice: parseFloat(inputs.buyPrice.value) || 0,
            targetAverage: parseFloat(inputs.targetAverage.value) || 0
        };
    }

    function validateInputs(values) {
        console.log('Validating inputs:', values);
        
        if (values.currentShares <= 0) {
            showError('Current shares must be greater than zero');
            return false;
        }
        
        if (values.currentAverage <= 0) {
            showError('Current average cost must be greater than zero');
            return false;
        }
        
        if (values.buyPrice <= 0) {
            showError('Purchase price must be greater than zero');
            return false;
        }
        
        if (values.targetAverage <= 0) {
            showError('Target average must be greater than zero');
            return false;
        }
        
        if (values.targetAverage <= values.buyPrice) {
            showError('Target average must be greater than purchase price');
            return false;
        }
        
        console.log('Validation passed');
        return true;
    }

    function calculate(values) {
        console.log('Performing calculation with values:', values);
        
        // Formula: x = S*(A - T) / (T - P)
        const sharesToBuyFloat = values.currentShares * (values.currentAverage - values.targetAverage) / (values.targetAverage - values.buyPrice);
        const sharesToBuyResult = Math.ceil(Math.max(0, sharesToBuyFloat));
        
        console.log('Shares to buy:', sharesToBuyResult);
        
        // Calculate summary
        const totalShares = values.currentShares + sharesToBuyResult;
        const totalCost = (values.currentShares * values.currentAverage) + (sharesToBuyResult * values.buyPrice);
        const newAverage = totalCost / totalShares;
        
        // Display main result
        const message = `To reach target average of ${formatCurrency(values.targetAverage)}, buy ${formatShares(sharesToBuyResult)} shares at ${formatCurrency(values.buyPrice)}`;
        results.mainResult.textContent = message;
        
        // Display summary
        results.sharesToBuy.textContent = formatShares(sharesToBuyResult);
        results.totalSharesAfter.textContent = formatShares(totalShares);
        results.totalCostAfter.textContent = formatCurrency(totalCost);
        results.newAverageAfter.textContent = formatCurrency(newAverage);
        
        // Generate multi-target table
        generateMultiTargetTable(values);
        
        showResults();
    }

    function generateMultiTargetTable(values) {
        console.log('Generating multi-target table...');
        const targets = [9.00, 8.75, 8.50, 8.25];
        
        results.multiTargetBody.innerHTML = '';
        
        targets.forEach(target => {
            const row = document.createElement('tr');
            
            if (target <= values.buyPrice) {
                row.innerHTML = `
                    <td>${formatCurrency(target)}</td>
                    <td style="color: var(--color-text-secondary); font-style: italic;">Not possible</td>
                    <td style="color: var(--color-text-secondary);">-</td>
                    <td style="color: var(--color-text-secondary);">-</td>
                `;
            } else if (target >= values.currentAverage) {
                row.innerHTML = `
                    <td>${formatCurrency(target)}</td>
                    <td style="color: var(--color-success);">Already achieved</td>
                    <td>${formatCurrency(0)}</td>
                    <td>${formatCurrency(values.currentAverage)}</td>
                `;
            } else {
                const sharesToBuy = Math.ceil(values.currentShares * (values.currentAverage - target) / (target - values.buyPrice));
                const purchaseCost = sharesToBuy * values.buyPrice;
                const totalShares = values.currentShares + sharesToBuy;
                const totalCost = (values.currentShares * values.currentAverage) + purchaseCost;
                const resultingAverage = totalCost / totalShares;
                
                row.innerHTML = `
                    <td>${formatCurrency(target)}</td>
                    <td>${formatShares(sharesToBuy)}</td>
                    <td>${formatCurrency(purchaseCost)}</td>
                    <td>${formatCurrency(resultingAverage)}</td>
                `;
            }
            
            results.multiTargetBody.appendChild(row);
        });
        
        console.log('Multi-target table generated');
    }

    function handleSubmit(e) {
        console.log('Form submitted');
        e.preventDefault();
        
        const values = getValues();
        console.log('Input values:', values);
        
        if (validateInputs(values)) {
            calculate(values);
        }
    }

    function handleClear(e) {
        console.log('Clear button clicked');
        e.preventDefault();
        
        inputs.currentShares.value = '';
        inputs.currentAverage.value = '';
        inputs.buyPrice.value = '';
        inputs.targetAverage.value = '';
        
        hideError();
        resultsSection.classList.add('hidden');
        
        inputs.currentShares.focus();
    }

    // Event listeners
    form.addEventListener('submit', handleSubmit);
    clearBtn.addEventListener('click', handleClear);
    
    console.log('Event listeners attached');
    console.log('Stock Calculator initialization complete');
});