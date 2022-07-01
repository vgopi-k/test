// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
//let sessionId = null;
const stripe = Stripe('pk_test_51Kt4KODxwpebz7SeUrDIkr8KiDLt7ji6VgRF2Ins7LgOhF5EZd5wx4pJJmDwXLtwxWQMZ7ZDp6c3xQCH5GOoYHYU00QRUxXMok');


const form = document.getElementById('create-checkout-session');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const serverResponse = await fetch('/create-checkout-session').then((r) => r.json())
  //sessionId = serverResponse.session_id;
  const checkout_session = {
    sessionId: serverResponse.session_id,
  }
  stripe.redirectToCheckout(checkout_session)
});

//await fetch('/success').then((r) => r.json());