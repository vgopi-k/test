// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
let clientSecret = null;
let elements = null;
const stripe = Stripe('pk_test_51Kt4KODxwpebz7SeUrDIkr8KiDLt7ji6VgRF2Ins7LgOhF5EZd5wx4pJJmDwXLtwxWQMZ7ZDp6c3xQCH5GOoYHYU00QRUxXMok');

const initPaymentElement = async () => {
  const serverResponse = await fetch('/secret').then((r) => r.json());
  //const serverResponse = await response.json();
  //print('PI client secret id - ' + clientSecret)
  //const secretResponse = await response.json();
  // Render the Payment Element using the clientSecret

  clientSecret = serverResponse.client_secret;
  const options = {
      clientSecret: clientSecret,
      loader: 'always',
      appearance: {
        theme: "default",
        variables: {
          borderRadius: "0",
          fontFamily: '"Josefin Sans", sans-serif',
          fontSmooth: "never",
          colorTextPlaceholder: "#ccc",
          colorPrimary: "#2d9fdb",
        }
      }
    };
    
  // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
  elements = stripe.elements(options);
    
  // Create and mount the Payment Element
  const paymentElement = elements.create('payment', {disallowedCardBrands: ['amex']});
  paymentElement.mount('#payment-element');
}

initPaymentElement();

const form = document.getElementById('payment-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const {error} = await stripe.confirmPayment({
    //`Elements` instance that was used to create the Payment Element
    elements,
    confirmParams: {
      return_url: `${location.origin}/success`,
    },
  });

  if (error) {
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Show error to your customer (for example, payment
    // details incomplete)
    const messageContainer = document.querySelector('#error-message');
    messageContainer.textContent = error.message;
  } else {
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
  }
});