# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

import os
import stripe
import json

from flask import Flask, redirect, render_template, jsonify, request

app = Flask(__name__)

stripe.api_key = 'sk_test_51Kt4KODxwpebz7SelRrgOCUQDhGowcyqrHrJ9CnbKZBN6gi6TjBxzOu3JXz5jujXNhr3hSM5xiEp1xGtzbdeOJVP00NkUAC3Uu'

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

@app.route('/charge', methods=['POST'])
def charge():
  data = request.get_json()

  # Create a Customer:
  customer = stripe.Customer.create(
    source=data['cardtoken'],
    name='seller-06',
  )

  # Charge the Customer instead of the card:
  charge = stripe.Charge.create(
    amount=1000,
    currency='aud',
    customer=customer.id,
  )
  return json.dumps({'success': True}), 201

if __name__== '__main__':
    app.run(port=4246)