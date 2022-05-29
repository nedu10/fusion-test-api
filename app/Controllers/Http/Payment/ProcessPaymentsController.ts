// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import PaymentService from "App/Services/Payment/PaymentMangement";
import VerifyPaymentValidator from "App/Validators/VerifyPaymentValidator";

export default class ProcessPaymentsController {
    public async verify_payment({ request, response }) {
        const props = await request.validate(VerifyPaymentValidator);
        let createResponse = await PaymentService.verify_payment(props.reference);

        return response
            .status(createResponse?.status_code)
            .send(createResponse);
    }
    // public async fetch_bank_list({ response }) {
    //     let createResponse = await PaystackService.fetch_bank_list();

    //     return response
    //         .status(createResponse?.status_code)
    //         .send(createResponse);
    // }
    // public async webhook({ request }) {
    //     await PaymentService.webhook(request);

    // }
}
