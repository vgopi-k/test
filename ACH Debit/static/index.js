// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
var clientSecret = null;
let elements = null;
var payment_method_id = null;
const stripe = Stripe('pk_test_51L3UbWBreRIaDzD9TAXw5OE99EIHxpCGDQYBsgM2vmA6iimWfA0kMkqgff0RO9bgA5lr7U9JRL9TyjX1EWsSCQxj00Hx1GzaMu');

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
        theme: "stripe",
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
  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');
}

initPaymentElement();


// Use the form that already exists on the web page.
const paymentMethodForm = document.getElementById('payment-form');
//const confirmationForm = document.getElementById('confirmation-form');

paymentMethodForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const accountHolderNameField = "Seller 02";
  const emailField = "seller-02@test.com";

    const {error} = stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${location.origin}/summary`,
      },
    }).then(stripePaymentIntentHandler);


    function stripePaymentIntentHandler(result) {
      if (result.error) {
        // Show error in payment form
      } else {
        // Otherwise send paymentMethod.id to your server (see Step 4)
          payment_method_id = result.payment_method
      }
    }
});
