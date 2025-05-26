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
        // Update the results in the UI
        document.getElementById('deckBoards').textContent = data.deck_boards || 0;
        document.getElementById('baseWood').textContent = data.base_wood || 0;
        document.getElementById('screws').textContent = data.screws || 0;
        
        // Update fasteners list
        const fastenersList = document.getElementById('fasteners');
        fastenersList.innerHTML = ''; // Clear existing items
        
        if (data.fasteners && data.fasteners.length > 0) {
            data.fasteners.forEach(fastener => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `${fastener.name} <span class="badge bg-primary rounded-pill">${fastener.quantity}</span>`;
                fastenersList.appendChild(li);
            });
            document.getElementById('fastenersList').classList.remove('d-none');
        } else {
            document.getElementById('fastenersList').classList.add('d-none');
        }
    }
    
    // Add input validation for decimal numbers
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 0) {
                this.value = 0;
            } else if (this.value > 1000) {
                this.value = 1000; // Reasonable max limit
            }
        });
    });
});
