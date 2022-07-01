// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
//let sessionId = null;
const stripe = Stripe('pk_test_51Kt4KODxwpebz7SeUrDIkr8KiDLt7ji6VgRF2Ins7LgOhF5EZd5wx4pJJmDwXLtwxWQMZ7ZDp6c3xQCH5GOoYHYU00QRUxXMok');


const form = document.getElementById('create-account');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  //const serverResponse = await fetch('/create-account').then((r) => r.json())
  //sessionId = serverResponse.session_id;
  //const account_activation = {
    //sessionId: serverResponse.account_url,
  //}
  //stripe.redirectToCheckout(serverResponse.account_url)
  const data = await fetch('/create-account').then((r) => r.json())
  const newUrl = data.url
  window.location.href = newUrl

});

//await fetch('/success').then((r) => r.json());