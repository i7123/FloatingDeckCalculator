document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('deckForm');
    const resultsSection = document.getElementById('results');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const length = parseFloat(document.getElementById('length').value);
        const width = parseFloat(document.getElementById('width').value);
        
        // Basic validation
        if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
            alert('Please enter valid dimensions (numbers greater than 0)');
            return;
        }
        
        try {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Calculating...';
            
            // Send data to server
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ length, width })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Update the UI with results
            updateResults(data);
            
            // Show results section
            resultsSection.classList.remove('d-none');
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while calculating. Please try again.');
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
    
    function updateResults(data) {
        // Update deck boards information
        document.getElementById('deckBoards').textContent = data.deck_boards || 0;
        document.getElementById('deckBoardsLinearFeet').textContent = data.deck_boards_linear_feet || 0;
        
        // Update base wood with board size and spacing info
        const baseWoodElement = document.getElementById('baseWood');
        baseWoodElement.textContent = data.base_wood || 0;
        
        // Update the framing info text
        const framingInfoElement = document.getElementById('framingInfo');
        if (framingInfoElement) {
            framingInfoElement.textContent = 
                `${data.board_size} @ ${data.joist_spacing}" OC (including 15% waste)`;
        }
        
        // Update screws
        document.getElementById('screws').textContent = data.screws ? data.screws.toLocaleString() : 0;
        
        // Update fasteners list
        const fastenersList = document.getElementById('fasteners');
        fastenersList.innerHTML = ''; // Clear existing items
        
        // Filter out the main screws from the fasteners list (since they're displayed separately)
        const additionalFasteners = data.fasteners || [];
        
        if (additionalFasteners.length > 0) {
            additionalFasteners.forEach(fastener => {
                // Skip the main deck screws (they're displayed separately)
                if (fastener.name.includes('Deck Screws')) return;
                
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `${fastener.name} <span class="badge bg-primary rounded-pill">${fastener.quantity}</span>`;
                fastenersList.appendChild(li);
            });
            
            // Only show the fasteners section if there are additional fasteners
            if (fastenersList.children.length > 0) {
                document.getElementById('fastenersList').classList.remove('d-none');
            } else {
                document.getElementById('fastenersList').classList.add('d-none');
            }
        } else {
            document.getElementById('fastenersList').classList.add('d-none');
        }
        
        // Re-enable the submit button and restore its original text
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Calculate Materials';
        }
    }
    
    // Add input validation for decimal numbers
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        // Validate on change
        input.addEventListener('change', function() {
            // Ensure the value is a valid number
            let value = parseFloat(this.value);
            if (isNaN(value)) {
                this.value = '';
                return;
            }
            
            // Round to nearest 0.5 (half foot increments)
            value = Math.round(value * 2) / 2;
            
            // Validate range
            if (value < 1) {
                value = 1; // Minimum deck size
                this.value = value;
            } else if (value > 100) {
                value = 100; // Maximum deck size
                this.value = value;
            } else if (value !== parseFloat(this.value)) {
                this.value = value; // Update with rounded value if changed
            }
            
            // Clear any previous error messages
            const errorElement = this.nextElementSibling;
            if (errorElement && errorElement.classList.contains('invalid-feedback')) {
                errorElement.remove();
            }
        });
        
        // Add real-time validation on input
        input.addEventListener('input', function() {
            // Allow only numbers and one decimal point
            this.value = this.value.replace(/[^0-9.]/g, '');
            
            // Ensure only one decimal point
            if ((this.value.match(/\./g) || []).length > 1) {
                this.value = this.value.slice(0, -1);
            }
            
            // Limit to one decimal place
            const parts = this.value.split('.');
            if (parts[1] && parts[1].length > 1) {
                parts[1] = parts[1].charAt(0);
                this.value = parts.join('.');
            }
        });
    });
    
    // Add form validation and submission
    const deckForm = document.getElementById('deckForm');
    let isSubmitting = false;
    
    deckForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Prevent multiple submissions
        if (isSubmitting) return;
        
        let isValid = true;
        const lengthInput = document.getElementById('length');
        const widthInput = document.getElementById('width');
        const submitBtn = this.querySelector('button[type="submit"]');
        
        // Clear previous error messages
        document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        lengthInput.classList.remove('is-invalid');
        widthInput.classList.remove('is-invalid');
        
        // Validate length
        if (!lengthInput.value || parseFloat(lengthInput.value) < 1) {
            showError(lengthInput, 'Please enter a valid length (minimum 1 foot)');
            isValid = false;
        }
        
        // Validate width
        if (!widthInput.value || parseFloat(widthInput.value) < 1) {
            showError(widthInput, 'Please enter a valid width (minimum 1 foot)');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        try {
            isSubmitting = true;
            
            // Show loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Calculating...';
            
            // Get form data
            const formData = {
                length: parseFloat(lengthInput.value),
                width: parseFloat(widthInput.value),
                use2x6: document.getElementById('use2x6').checked
            };
            
            // Send data to server
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Update the UI with results
            updateResults(data);
            
            // Show results section
            document.getElementById('results').classList.remove('d-none');
            
            // Scroll to results
            document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while calculating. Please try again.');
            
            // Re-enable the submit button on error
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Calculate Materials';
            }
        } finally {
            isSubmitting = false;
        }
    });
    
    // Reset form button functionality
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-outline-secondary mt-3';
    resetBtn.textContent = 'Reset Form';
    resetBtn.addEventListener('click', function() {
        deckForm.reset();
        document.getElementById('results').classList.add('d-none');
    });
    
    // Add reset button after the form
    deckForm.appendChild(resetBtn);
    
    function showError(input, message) {
        input.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
});
