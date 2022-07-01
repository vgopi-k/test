// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
let clientSecret = null;
let cardElement = null;
const stripe = Stripe('pk_test_51Kt4KODxwpebz7SeUrDIkr8KiDLt7ji6VgRF2Ins7LgOhF5EZd5wx4pJJmDwXLtwxWQMZ7ZDp6c3xQCH5GOoYHYU00QRUxXMok');

const initCardElement = async () => {

  var elements = stripe.elements();

    // Set up Stripe.js and Elements to use in checkout form
    var style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      },
    };

    cardElement = elements.create('card', {style: style});
    cardElement.mount('#card-element');
}

initCardElement();

var form = document.getElementById('payment-form');

form.addEventListener('submit', function(event) {
  // We don't want to let default form submission happen here,
  // which would refresh the page.
  event.preventDefault();

  stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: {
      // Include any additional collected billing details.
      name: 'Gopi Krishna',
    },
  }).then(stripePaymentMethodHandler);
});

function stripePaymentMethodHandler(result) {
  if (result.error) {
    // Show error in payment form
  } else {
    // Otherwise send paymentMethod.id to your server (see Step 4)
    fetch('/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_method_id: result.paymentMethod.id,
      })
    }).then(function(result) {
      // Handle server response (see Step 4)
      result.json().then(function(json) {
        handleServerResponse(json);
      })
    });
  }
}

function handleServerResponse(response) {
  if (response.error) {
    // Show error from server on payment form
  } else if (response.requires_action) {
    // Use Stripe.js to handle required card action
    stripe.handleCardAction(
      response.payment_intent_client_secret
    ).then(handleStripeJsResult);
  } else {
    // Show success message
  }
}

function handleStripeJsResult(result) {
  if (result.error) {
    // Show error in payment form
  } else {
    // The card action has been handled
    // The PaymentIntent can be confirmed again on the server
    fetch('/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_intent_id: result.paymentIntent.id })
    }).then(function(confirmResult) {
      return confirmResult.json();
    }).then(handleServerResponse);
  }
}

