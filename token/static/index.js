// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
let clientSecret = null;
let card = null;
const stripe = Stripe('pk_test_51Kt4KODxwpebz7SeUrDIkr8KiDLt7ji6VgRF2Ins7LgOhF5EZd5wx4pJJmDwXLtwxWQMZ7ZDp6c3xQCH5GOoYHYU00QRUxXMok');
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
var style = {
  base: {
    // Add your base input styles here. For example:
    fontSize: '16px',
    color: '#32325d',
  },
};

// Create an instance of the card Element.
card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');


// Create a token or display an error when the form is submitted.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the customer that there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
        // Send the token to your server.
        fetch('/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardtoken: result.token.id,
        })
      })
    }
  });
});
