// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BeneficiaryService from "App/Services/Account/BeneficiaryManagement";
import CreateBeneficiaryValidator from "App/Validators/CreateBeneficiaryValidator";

export default class BeneficiariesController {
    public async create_beneficiary({ request, auth, response }) {
        const props = await request.validate(CreateBeneficiaryValidator);
    
        let createResponse = await BeneficiaryService.create_beneficiary({ ...props, user_id: auth.user.id });
    
        return response
          .status(createResponse.status_code)
          .send(createResponse);
      }
      public async remove_beneficiary({ auth, response, params: { beneficiary_id } }) {
        let createResponse = await BeneficiaryService.remove_beneficiary(auth.user, beneficiary_id);
    
        return response
          .status(createResponse.status_code)
          .send(createResponse);
      }
      public async get_beneficiaries({ auth, response }) {
        let createResponse = await BeneficiaryService.get_beneficiaries(auth.user);
    
        return response
          .status(createResponse.status_code)
          .send(createResponse);
      }
      public async get_beneficiary({ auth, response, params: { beneficiary_id } }) {
        let createResponse = await BeneficiaryService.get_beneficiary(auth.user, beneficiary_id);
    
        return response
          .status(createResponse.status_code)
          .send(createResponse);
      }
}
