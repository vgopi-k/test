# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

import os
import stripe

from flask import Flask, redirect, render_template, jsonify

app = Flask(__name__,
            static_url_path='',
            static_folder='')

stripe.api_key = 'sk_test_51L3UbWBreRIaDzD9sZ52uGzsz2xH27j5WZtto7Vv2o5jDUMJoY7opXkRURKtDHQaYFvUeDNfH8ZJZe4Hr5mYbi5C00rry4Urb7'

@app.route("/")
def hello():
    return render_template('index.html')

@app.route('/success', methods=['GET'])
def success():
  #session = stripe.checkout.Session.retrieve(request.args.get('session_id'))
  #customer = stripe.Customer.retrieve(session.customer)
  return render_template('success.html')


@app.route("/create-checkout-session")
def create_checkout_session():
  session = stripe.checkout.Session.create(
    line_items=[{
      'price_data': {
        'currency': 'aud',
        'product_data': {
          'name': 'Tesla',
        },
        'unit_amount': 6900000,
      },
      'quantity': 1,
    }],
    mode='payment',
    success_url='http://localhost:4245/success',
    #success_url=render_template('success.html'),
    cancel_url='http://localhost:4245',
    
  )
  return jsonify(session_id=session.id)

if __name__== '__main__':
    app.run(port=4245)