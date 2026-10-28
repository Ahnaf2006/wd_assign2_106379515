// ==========================================================================
// CineWave - Master External JavaScript (COS10009 Compliant)
// ==========================================================================

const TICKET_PRICE = 15.00; // Standard ticket price in AUD

// Run setup when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    // 1. Pre-fill movie dropdown if passed via URL parameters (from movies/recommend page)
    const urlParams = new URLSearchParams(window.location.search);
    const movieParam = urlParams.get('movie');
    if (movieParam && document.getElementById('movie')) {
        document.getElementById('movie').value = movieParam;
    }

    // 2. Dynamic Cost Calculation Listener for Booking Form
    const ticketsInput = document.getElementById('tickets');
    if (ticketsInput) {
        ticketsInput.addEventListener('input', updateTotalPrice);
        updateTotalPrice(); // Initial calculation on load
    }

    // 3. Conditional Payment Fields Listener
    const paymentSelect = document.getElementById('paymentMethod');
    if (paymentSelect) {
        paymentSelect.addEventListener('change', togglePaymentFields);
    }
});

// Calculate and update total price dynamically based on ticket count
function updateTotalPrice() {
    const tickets = parseInt(document.getElementById('tickets').value) || 1;
    const total = tickets * TICKET_PRICE;
    const totalCostEl = document.getElementById('totalCostDisplay');
    if (totalCostEl) {
        totalCostEl.textContent = `$${total.toFixed(2)} AUD`;
    }
}

// Show/hide credit card fields conditionally based on the selected payment method
function togglePaymentFields() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const ccContainer = document.getElementById('creditCardDetails');
    
    if (paymentMethod === 'Credit Card') {
        ccContainer.style.display = 'block';
        document.getElementById('cardNumber').required = true;
        document.getElementById('cardExpiry').required = true;
        document.getElementById('cardCvv').required = true;
    } else {
        ccContainer.style.display = 'none';
        document.getElementById('cardNumber').required = false;
        document.getElementById('cardExpiry').required = false;
        document.getElementById('cardCvv').required = false;
    }
}

// Booking Form Validation & Submission Logic
function handleBooking(e) {
    e.preventDefault();

    const movie = document.getElementById('movie').value;
    const tickets = document.getElementById('tickets').value;
    const date = document.getElementById('date').value;
    const name = document.getElementById('fullname').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    // Basic validation check
    if (!movie || !tickets || !date || !name || !phone || !paymentMethod) {
        alert("Please fill in all required booking fields.");
        return;
    }

    // Credit Card specific validation if selected
    if (paymentMethod === 'Credit Card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;

        if (cardNumber.length < 16 || !/^\d+$/.test(cardNumber)) {
            alert("Please enter a valid 16-digit credit card number.");
            document.getElementById('cardNumber').focus();
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            alert("Please enter a valid expiry date in MM/YY format.");
            document.getElementById('cardExpiry').focus();
            return;
        }
        if (cardCvv.length < 3 || !/^\d+$/.test(cardCvv)) {
            alert("Please enter a valid 3-digit CVV.");
            document.getElementById('cardCvv').focus();
            return;
        }
    }

    const totalCost = (tickets * TICKET_PRICE).toFixed(2);

    // Populate confirmation view
    document.getElementById('conf-name').textContent = name;
    document.getElementById('conf-movie').textContent = `${movie} (${tickets} ticket${tickets > 1 ? 's' : ''})`;
    document.getElementById('conf-date').textContent = date;
    document.getElementById('conf-total').textContent = `$${totalCost} AUD via ${paymentMethod}`;

    // Switch form view to confirmation card
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('confirmation-box').style.display = 'block';

    // Simulated SMS Toast Notification
    showToast(`Hi ${name}, your booking for ${movie} is confirmed! Total: $${totalCost}. Ref: #CW-${Math.floor(1000 + Math.random() * 9000)}`);
}

// Reset booking form back to initial state
function resetBookingForm() {
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingForm').style.display = 'block';
    document.getElementById('confirmation-box').style.display = 'none';
    updateTotalPrice();
    togglePaymentFields();
}

// Recommendation Engine Logic
function generateRecommendation(e) {
    e.preventDefault();
    const genre = document.getElementById('genre').value;
    const resultBox = document.getElementById('recommendation-result');
    const titleBox = document.getElementById('recommended-title');
    const descBox = document.getElementById('recommended-desc');

    if (!genre) return;

    let movie = "Interstellar";
    let desc = "An epic sci-fi journey across space and time exploring human survival.";

    if (genre === "Comedy") {
        movie = "3 Idiots";
        desc = "A hilarious and heartwarming comedy-drama about college life and following your passion.";
    } else if (genre === "Horror") {
        movie = "The Nun";
        desc = "A terrifying supernatural horror mystery investigating a dark haunted abbey.";
    } else if (genre === "Animation") {
        movie = "The Incredibles";
        desc = "An incredible animated family action adventure about a family of undercover superheroes.";
    }

    titleBox.textContent = movie;
    descBox.textContent = desc;
    resultBox.style.display = "block";
}

// Floating Toast Notification Helper (Simulated SMS)
function showToast(message) {
    let existingToast = document.getElementById('smsToast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'smsToast';
    toast.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; background: #1a1a1a;
        border-left: 5px solid #e50914; color: #ffffff; padding: 1rem 1.5rem;
        border-radius: 8px; box-shadow: 0 5px 25px rgba(0,0,0,0.7); z-index: 9999;
        display: flex; flex-direction: column; gap: 4px; transition: transform 0.4s ease;
    `;
    toast.innerHTML = `<span style="font-weight: 700; font-size: 0.85rem; color: #e50914; text-transform: uppercase;">💬 Message from CineWave</span><span style="font-size: 0.95rem; color: #e2e8f0;">${message}</span>`;
    
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.transform = 'translateY(0)'; }, 50);
    setTimeout(() => { 
        toast.style.transform = 'translateY(150%)';
        setTimeout(() => toast.remove(), 400);
    }, 6000);
}