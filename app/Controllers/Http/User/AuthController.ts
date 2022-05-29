// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import LoginService from "App/Services/Auth/Login";
import RegistrationService from "App/Services/Auth/Registration";
import LoginValidator from "App/Validators/LoginValidator";
import RegistrationValidator from "App/Validators/RegistrationValidator";

export default class AuthController {
    public async registration({ request, response }) {
        const props = await request.validate(RegistrationValidator);
        let registrationResponse = await RegistrationService.register(props);

        return response.status(registrationResponse.status_code).send(registrationResponse);
    }

    public async login({ request, response, auth }) {
        const props = await request.validate(LoginValidator);
        let loginResponse = await  LoginService.login({ ...props, auth });

        return response.status(loginResponse.status_code).send(loginResponse);
    }
}
