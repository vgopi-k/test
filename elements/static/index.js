// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
let clientSecret = null;
let elements = null;
// US Account
//const stripe = Stripe('pk_test_51L3UbWBreRIaDzD9TAXw5OE99EIHxpCGDQYBsgM2vmA6iimWfA0kMkqgff0RO9bgA5lr7U9JRL9TyjX1EWsSCQxj00Hx1GzaMu', {
  //betas: ["express_checkout_element_beta_1"],
//});

// AU Account
const stripe = Stripe('pk_test_51L2VvPHHzkSy25ARlDfycEwqVeBrIEM7iMo1uNCl2gOL22XTjUfib6wroIkKtF90KvH25eKkgum62OaPdxGwmqcY006TDHsSc4', {
  betas: ["express_checkout_element_beta_1"],
})

const initPaymentElement = async () => {
  const serverResponse = await fetch('/secret').then((r) => r.json());
  //const serverResponse = await response.json();
  //print('PI client secret id - ' + clientSecret)
  //const secretResponse = await response.json();
  // Render the Payment Element using the clientSecret

  clientSecret = serverResponse.client_secret;
  //const loader = 'auto'

  const options = {
    //clientSecret: clientSecret,
    mode: 'payment',
    amount: 1000,
    currency: 'aud',
    apperance: {
      them: 'stripe',
    }
  }
    
  // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
  elements = stripe.elements(options);

  // Create Link Element
  const linkAuthenticationElement = elements.create("linkAuthentication", {defaultValues: {email: "mail2gopi1988@gmail.com"}});
    
  // Create Express Checkout Element
  const expressCheckoutElement = elements.create('expressCheckout');
  // Create and mount the Payment Element
  const paymentElement = elements.create('payment', {
    layout: {
      type: 'accordion',
      defaultCollapsed: false,
      radios: true,
      spacedAccordionItems: false
    }
  });

  // Mount the Elements to their corresponding DOM node
  //linkAuthenticationElement.mount('#link-authentication-element');
  expressCheckoutElement.mount('#express-checkout-element');
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