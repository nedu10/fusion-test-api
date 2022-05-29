/*
|--------------------------------------------------------------------------
| Core Routes
|--------------------------------------------------------------------------
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/wallet-funding", "Account/WalletsController.wallet_funding");
  Route.post("/wallet-withdrawal", "CoreController.wallet_withdrawal");
  Route.post("/fund-transfer", "CoreController.wallet_transfer");
  Route.post("/create-beneficiary", "CoreController.create_beneficiary");
  Route.delete("/remove-beneficiary/:beneficiary_id", "CoreController.remove_beneficiary");
  Route.get("/get-beneficiaries", "CoreController.get_beneficiaries");
  Route.get("/get-beneficiaries/:beneficiary_id", "CoreController.get_beneficiary");
})
  .middleware("auth")
  .prefix("/api/v1/account");
