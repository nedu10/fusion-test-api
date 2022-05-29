/*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/generate-reference", "Payment/PaymentManagementsController.generate_reference");
  Route.post("/verify-payment", "Payment/ProcessPaymentsController.verify_payment");
  Route.get("/fetch_transactions", "Payment/PaymentManagementsController.fetch_transactions");
  Route.get("/fetch_transactions/:transaction_id", "Payment/PaymentManagementsController.fetch_single_transaction");
  Route.get("/fetch_bank_list", "Payment/ProcessPaymentsController.fetch_bank_list");
})
  .middleware("auth")
  .prefix("/api/v1/transaction");

Route.group(() => {
  Route.post("/webhook", "Payment/ProcessPaymentsController.webhook");
})
  .prefix("/api/v1/transaction");
