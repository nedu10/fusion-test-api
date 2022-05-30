import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WalletService from 'App/Services/Account/WalletManagement';
import PaymentService from 'App/Services/Payment/PaymentMangement';
import WalletFundingValidator from 'App/Validators/WalletFundingValidator';
import WalletTransferValidator from 'App/Validators/WalletTransferValidator';
import WalletWithdrawalValidator from 'App/Validators/WalletWithdrawalValidator';

export default class WalletsController {
    public async wallet_funding({ request, auth, response }) {
        const props = await request.validate(WalletFundingValidator);

        let createResponse = await PaymentService.initiate_payment(props, auth.user);

        return response
            .status(createResponse.status_code)
            .send(createResponse);
    }
    public async wallet_transfer({ request, auth, response }) {
        const props = await request.validate(WalletTransferValidator);

        let createResponse = await WalletService.transfer_money(props, auth.user);

        return response
            .status(createResponse.status_code)
            .send(createResponse);
    }
    public async wallet_withdrawal({ request, response, auth }) {
        // public async wallet_withdrawal({ request, auth, response }) {
        const props = await request.validate(WalletWithdrawalValidator);

        let createResponse = await WalletService.wallet_withdrawal(props, auth.user);
        // let createResponse = await WalletService.wallet_withdrawal(props, auth.user);

        return response
            .status(createResponse.status_code)
            .send(createResponse);
    }
}
