# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

import os
import stripe

from flask import Flask, redirect, render_template, jsonify

app = Flask(__name__,
            static_url_path='',
            static_folder='')

stripe.api_key = 'sk_test_51L2VvPHHzkSy25ARCiZwss3UZOVAwzM7RcudofprNe4UudxsGq43le6iy63GSs8nPZo4CeR5mrTYfGg0rG1No99H00ZvzbiUWG'

@app.route("/")
def hello():
    return render_template('index.html')

@app.route('/success', methods=['GET'])
def success():
  #session = stripe.checkout.Session.retrieve(request.args.get('session_id'))
  #customer = stripe.Customer.retrieve(session.customer)
  return render_template('success.html')


@app.route("/create-account")
def create_account():
  
  connected_account = stripe.Account.create(
    type="standard",
    country="AU",
    email="gk06@test.com",
    #capabilities={
    #  "card_payments": {"requested": True},
    #  "transfers": {"requested": True},
    #},
    individual={
      "first_name":"GK",
      "last_name":"06",
      "dob": {"day": "01", "month": "01", "year":"1991"},
      "address": {"line1": "222 exhibition street", "postal_code": "3000", "city":"Melbourne", "state":"Victoria"},
      "email":"gk06@test.com",
      "phone":"+61 0 0000 0000"
    },
    business_type="individual",
    business_profile={
      "mcc": "5045",
      "url": "thesofwarecompany.com"
    },
  )
  connected_account_link = stripe.AccountLink.create(
    account= connected_account.id,
    refresh_url="http://127.0.0.1:4248/success",
    return_url="http://127.0.0.1:4248/success",
    type="account_onboarding",
  )
  print(connected_account_link.url)
  return jsonify(url=connected_account_link.url)


if __name__== '__main__':
    app.run(port=4248)