/*
|--------------------------------------------------------------------------
| Core Routes
|--------------------------------------------------------------------------
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "User/AuthController.profile");
  Route.post("/wallet-funding", "Account/WalletsController.wallet_funding");
  Route.post("/wallet-withdrawal", "Account/WalletsController.wallet_withdrawal");
  Route.post("/fund-transfer", "Account/WalletsController.wallet_transfer");
  Route.post("/create-beneficiary", "Account/BeneficiariesController.create_beneficiary");
  Route.delete("/remove-beneficiary/:beneficiary_id", "Account/BeneficiariesController.remove_beneficiary");
  Route.get("/get-beneficiaries", "Account/BeneficiariesController.get_beneficiaries");
  Route.get("/get-beneficiaries/:beneficiary_id", "Account/BeneficiariesController.get_beneficiary");
})
  .middleware("auth")
  .prefix("/api/v1/account");
