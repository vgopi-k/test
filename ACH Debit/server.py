# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

import os
import stripe
import json

from flask import Flask, redirect, render_template, jsonify, request

app = Flask(__name__)

stripe.api_key = 'sk_test_51L3UbWBreRIaDzD9sZ52uGzsz2xH27j5WZtto7Vv2o5jDUMJoY7opXkRURKtDHQaYFvUeDNfH8ZJZe4Hr5mYbi5C00rry4Urb7'

# Token is created using Stripe Checkout or Elements!
# Get the payment token ID submitted by the form:
#token = request.form['stripeToken'] # Using Flask

@app.route("/")
def hello():
    return render_template('index.html')

@app.route('/create-checkout-session', methods=['POST'])
def checkout():
  return render_template('checkout.html')

@app.route('/success', methods=['GET'])
def success():
  #session = stripe.checkout.Session.retrieve(request.args.get('session_id'))
  #customer = stripe.Customer.retrieve(session.customer)
  return render_template('success.html')

@app.route('/summary', methods=['GET'])
def summary():
  #session = stripe.checkout.Session.retrieve(request.args.get('session_id'))
  #customer = stripe.Customer.retrieve(session.customer)
  return render_template('summary.html')

@app.route('/secret')
def charge():

  # Create a Customer:
  customer = stripe.Customer.create(
    name='seller-02',
  )

  # Charge the Customer instead of the card:
  setup_intent = stripe.SetupIntent.create(
    customer=customer.id,
    payment_method_types=["us_bank_account"],
  )

  return jsonify(client_secret=setup_intent.client_secret)

# AJAX endpoint when `/pay` is called from client
@app.route('/pay', methods=['POST'])
def pay():
  data = request.get_json()
  intent = None

  try:
    if 'payment_method_id' in data:
      # Create the PaymentIntent
      intent = stripe.PaymentIntent.create(
        payment_method = data['payment_method_id'],
        amount = 6900000,
        currency = 'aud',
        confirmation_method = 'manual',
        confirm = True,
        return_url = 'http://localhost:4247/success'
      )
    elif 'payment_intent_id' in data:
      intent = stripe.PaymentIntent.confirm(
        data['payment_intent_id'],
        return_url = 'http://localhost:4247/success'
        )
  except stripe.error.CardError as e:
    # Display error on client
    return json.dumps({'error': e.user_message}), 200

if __name__== '__main__':
    app.run(port=4246)