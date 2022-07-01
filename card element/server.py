# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

import os
import stripe
import json

from flask import Flask, redirect, render_template, jsonify, request

app = Flask(__name__)

stripe.api_key = 'sk_test_51Kt4KODxwpebz7SelRrgOCUQDhGowcyqrHrJ9CnbKZBN6gi6TjBxzOu3JXz5jujXNhr3hSM5xiEp1xGtzbdeOJVP00NkUAC3Uu'

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

  return generate_response(intent)

def generate_response(intent):
  # Note that if your API version is before 2019-02-11, 'requires_action'
  # appears as 'requires_source_action'.
  if intent.status == 'requires_action' and intent.next_action.type == 'use_stripe_sdk':
    # Tell the client to handle the action
    return json.dumps({
      'requires_action': True,
      'payment_intent_client_secret': intent.client_secret,
    }), 200
  elif intent.status == 'succeeded':
    # The payment didn’t need any additional actions and completed!
    # Handle post-payment fulfillment
    return json.dumps({'success': True}), 201
    #return render_template('success.html')
  else:
    # Invalid status
    return json.dumps({'error': 'Invalid PaymentIntent status'}), 500

if __name__== '__main__':
    app.run(port=4247)