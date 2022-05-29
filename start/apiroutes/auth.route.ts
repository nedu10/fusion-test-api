/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/registration", "User/AuthController.registration");
  Route.post("/login", "User/AuthController.login");
}).prefix("/api/v1/auth");
