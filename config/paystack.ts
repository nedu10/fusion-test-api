"use strict";

/** @type {import('@adonisjs/framework/src/Env')} */
import Env from '@ioc:Adonis/Core/Env'

const paystackConfig = {
  /*
  |--------------------------------------------------------------------------
  | Payment Initialization Endpoint
  |--------------------------------------------------------------------------
  |
  | initialize payment with paystack
  |
  */
  initializePaymentEndpoint: "https://api.paystack.co/transaction/initialize",

  /*
  |--------------------------------------------------------------------------
  | Payment Verification Endpoint
  |--------------------------------------------------------------------------
  |
  | verify payment with paystack
  |
  */
  verifyPaymentEndpoint: "https://api.paystack.co/transaction/verify",
  /*
  |--------------------------------------------------------------------------
  | Charge Card Endpoint
  |--------------------------------------------------------------------------
  |
  | charge card with paystack
  |
  */
  chargeCardEndpoint:
    "https://api.paystack.co/transaction/charge_authorization",
  /*
  |--------------------------------------------------------------------------
  | Get Account Info Endpoint
  |--------------------------------------------------------------------------
  |
  | get account info with paystack
  |
  */
  getAccountInformationEndpoint: "https://api.paystack.co/bank/resolve",
  /*
  |--------------------------------------------------------------------------
  | Get Account Info Endpoint
  |--------------------------------------------------------------------------
  |
  | get account info with paystack
  |
  */
  bankListEndpoint: "https://api.paystack.co/bank",

  /*
  |--------------------------------------------------------------------------
  | transfer Recipient
  |--------------------------------------------------------------------------
  |
  |
  */
  transferRecipientEndpoint: "https://api.paystack.co/transferrecipient",
  /*
  |--------------------------------------------------------------------------
  | transfer 
  |--------------------------------------------------------------------------
  |
  |
  */
  transferEndpoint: "https://api.paystack.co/transfer",

  /*
  |--------------------------------------------------------------------------
  | Public Key
  |--------------------------------------------------------------------------
  |
  |
  */
  public: Env.get("PAYSTACK_PUBLIC"),

  /*
  |--------------------------------------------------------------------------
  | Secret
  |--------------------------------------------------------------------------
  |
  |
  */
  secret: Env.get("PAYSTACK_SECRET"),
};


export default paystackConfig