# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

import os
import stripe

from flask import Flask, redirect, render_template, jsonify

app = Flask(__name__)

stripe.api_key = 'sk_test_51Kt4KODxwpebz7SelRrgOCUQDhGowcyqrHrJ9CnbKZBN6gi6TjBxzOu3JXz5jujXNhr3hSM5xiEp1xGtzbdeOJVP00NkUAC3Uu'

@app.route("/")
def hello():
    return render_template('index.html')


@app.route('/create-checkout-session', methods=['POST'])
def checkout():
  return render_template('checkout.html')

@app.route("/success")
def success():
    return render_template('success.html')

@app.route('/secret')
def secret():
  intent = stripe.PaymentIntent.create( # ... Fetch or create the PaymentIntent
    amount=6900000,
    currency="aud",
    automatic_payment_methods={"enabled": True},
  )
  return jsonify(client_secret=intent.client_secret)

#  return redirect(session.url, code=303)

if __name__== '__main__':
    app.run(port=4246)