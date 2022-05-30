/**
 * Handle beneficiary management Activities
 *
 * @param {Object}
 *
 * @returns {Object}
 */

 import Beneficiary from "App/Models/Beneficiary";
 import User from "App/Models/User";
 import CreateOperationResponse from "App/Utilities/CreateOperationResponse";
 import { IBeneficiaryCreation } from "Contracts/interface";
 import PaystackService from "../Payment/Paystack";
 
 export default class BeneficiaryService {
   static async create_beneficiary(data: IBeneficiaryCreation) {
     try {
       const resolve_acc_number = await PaystackService.resolve_account_number(
         data.account_number,
         data.bank_code
       );
 
       if (resolve_acc_number.status_code !== 200) {
         return resolve_acc_number;
       }
 
     //   console.log("resolve_acc_number >> ", resolve_acc_number);
       
       const create_bene = await Beneficiary.create({
         ...data,
         account_name: resolve_acc_number.results.account_name
       });
 
       return CreateOperationResponse({
         results: create_bene,
         label: `Create Beneficiary`,
         status: "Success",
         statusCode: 200,
         message: `Beneficiary successfully created`,
       });
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Create Beneficiary`,
         statusCode: 400,
         message: `Unable to process create beneficiary`,
       });
     }
   }
   static async remove_beneficiary(user: User, beneficiary_id: number) {
     try {
       await Beneficiary.query()
         .where({
           id: beneficiary_id,
           user_id: user.id,
         })
         .delete();
 
       return CreateOperationResponse({
         results: {},
         label: `Delete Beneficiary`,
         status: "Success",
         statusCode: 200,
         message: `Beneficiary successfully deleted`,
       });
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Delete Beneficiary`,
         statusCode: 400,
         message: `Unable to process delete beneficiary`,
       });
     }
   }
   static async get_beneficiaries(user: User) {
     try {
       const beneficiaries = await Beneficiary.query().where({
         user_id: user.id,
       });
 
       return CreateOperationResponse({
         results: beneficiaries,
         label: `Get Beneficiaries`,
         status: "Success",
         statusCode: 200,
         message: `Beneficiary successfully fetched`,
       });
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Get Beneficiaries`,
         statusCode: 400,
         message: `Unable to process fetch beneficiary`,
       });
     }
   }
   static async get_beneficiary(user: User, beneficiary_id: number) {
     try {
       const beneficiary = await Beneficiary.query()
         .where({
           user_id: user.id,
           id: beneficiary_id,
         })
         .first();

       if (!beneficiary) {
        return CreateOperationResponse({
            results: beneficiary,
            error: { message: "Benefiary does not exist", status: "failed" },
            label: `Get Beneficiary`,
            statusCode: 400,
            message: `Benefiary does not exist`,
        });
       }
 
       return CreateOperationResponse({
         results: beneficiary,
         label: `Get Beneficiary`,
         status: "Success",
         statusCode: 200,
         message: `Beneficiary successfully fetched`,
       });
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Get Beneficiary`,
         statusCode: 400,
         message: `Unable to process fetch beneficiary`,
       });
     }
   }
 }
 