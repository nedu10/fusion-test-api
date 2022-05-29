/**
 * Handle Paystack Activities
 *
 * @param {Object}
 *
 * @returns {Object}
 */

 import Transaction from "App/Models/Transaction";
 import { generatePaystackString } from "App/Utilities/CodeGenerator";
 import CreateOperationResponse from "App/Utilities/CreateOperationResponse";
 import axios from "axios";
 import paystackConfig from "Config/paystack";
 import { TransactionStatus } from "Contracts/enum";
 import { IInitializePayment, ITransferRecipient } from "Contracts/interface";
 
 export default class PaystackService {
   protected data;
   constructor(data) {
     this.data = data;
   }
   static async generate_reference() {
     try {
       const reference = `T${generatePaystackString(14)}`;
 
       const exists = await Transaction.findBy("reference", reference);
 
       if (!exists) {
         return { reference, status_code: 200 };
       }
       await this.generate_reference();
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Generate reference`,
         statusCode: 400,
         message: `Unable to process generate reference`,
       });
     }
   }
   static async initialize_payment(data: IInitializePayment) {
     try {
       const { user_id, amount, reference, email, entity } = data;
 
       let payload = {
         key: paystackConfig["public"],
         user_id,
         amount: amount * 100,
         email,
         reference,
         currency: "NGN",
         metadata: {
           user_id,
           email,
           entity,
           amount,
         },
         channels: [
           "card",
           "bank",
           "ussd",
           "qr",
           "mobile_money",
           "bank_transfer",
         ],
       };
 
       const initializePaymentResponse = await axios.post(
         paystackConfig["initializePaymentEndpoint"],
         payload,
         {
           headers: {
             Authorization: `Bearer ${paystackConfig["secret"]}`,
           },
         }
       );
 
    //    console.log("initializePaymentResponse >> ", initializePaymentResponse);
 
       const new_payment = new Transaction();
       new_payment.user_id = user_id;
       new_payment.reference = reference;
       new_payment.entity = entity;
       new_payment.status = TransactionStatus.PENDING;
       new_payment.amount = amount;
 
       await new_payment.save();
 
       return CreateOperationResponse({
         results: initializePaymentResponse.data,
         statusCode: 200,
         status: "success",
         label: `initiate Payment`,
         message: "Payment initialized",
       });
     } catch (error) {
       // console.log('error >> ', error);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Initiate Payment`,
         statusCode: 400,
         message: error.response.data.message || `Unable to initiate payment`,
       });
     }
   }
 
   static async verify_payment(reference: string) {
     try {
       console.log("hrtrh");
 
       const verifyPaymentResponse: any = await axios.get(
         `${paystackConfig["verifyPaymentEndpoint"]}/${encodeURIComponent(
           reference
         )}`,
         {
           headers: {
             authorization: `Bearer ${paystackConfig["secret"]}`,
           },
         }
       );
 
       console.log("verifyPaymentResponse >> ", verifyPaymentResponse);
 
       const { data: payment_data } = verifyPaymentResponse.data;
 
       if (payment_data.status != "success") {
         return CreateOperationResponse({
           results: payment_data,
           error: payment_data.gateway_response,
           label: `paystack verify`,
           statusCode: 400,
           message: `Unable to verify paystack payment request`,
         });
       }
 
       return CreateOperationResponse({
         results: {
           data: verifyPaymentResponse.data.data,
           authorization: verifyPaymentResponse.authorization,
           customer: verifyPaymentResponse.customer,
         },
         statusCode: 200,
         status: "success",
         label: `paystack verify`,
         message: "Payment Verified",
       });
     } catch (error) {
       console.log("error >> ", error);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Verify Payment`,
         statusCode: 400,
         message: error.response.data.message || `Unable to verify payment`,
       });
     }
   }
   static async fetch_bank_list() {
     try {
       const bankListResponse: any = await axios.get(
         `${paystackConfig["bankListEndpoint"]}`,
         {
           headers: {
             authorization: `Bearer ${paystackConfig["secret"]}`,
           },
         }
       );
 
       console.log("bankListResponse >> ", bankListResponse);
 
       const { data: bank_list } = bankListResponse.data;
 
       return CreateOperationResponse({
         results: bank_list,
         statusCode: 200,
         status: "success",
         label: `paystack bank list`,
         message: "Successfully fetched bank list",
       });
     } catch (error) {
       console.log("error >> ", error);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `paystack bank list`,
         statusCode: 400,
         message: error.response.data.message || `Unable to fetch bank list`,
       });
     }
   }
   static async resolve_account_number(
     account_number: string,
     bank_code: string
   ) {
     try {
       const resolveAccountNumber: any = await axios.get(
         `${
           paystackConfig["getAccountInformationEndpoint"]
         }?account_number=${encodeURIComponent(
           account_number
         )}&bank_code=${encodeURIComponent(bank_code)}`,
         {
           headers: {
             authorization: `Bearer ${paystackConfig["secret"]}`,
           },
         }
       );
 
       console.log("resolveAccountNumber >> ", resolveAccountNumber);
 
       const { data: resolve_account_number } = resolveAccountNumber.data;
 
       // console.log("resolve_account_number >> ", resolve_account_number);
 
       return CreateOperationResponse({
         results: resolve_account_number,
         statusCode: 200,
         status: "success",
         label: `paystack resolve account number`,
         message: "Successfully resolved account number",
       });
     } catch (error) {
       console.log("error >> ", error.response.data);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `paystack resolve account number`,
         statusCode: 400,
         message:
           error.response.data.message || `Unable to resolve account number`,
       });
     }
   }
   static async transfer_recipient(data: ITransferRecipient, user_id: number) {
     try {
       const transferRecipient: any = await axios.post(
         `${paystackConfig["transferRecipientEndpoint"]}`,
         {...data, metadata: {user_id}},
         {
           headers: {
             authorization: `Bearer ${paystackConfig["secret"]}`,
           },
         }
       );
 
       console.log("transferRecipient >> ", transferRecipient);
 
       const { data: transfer_recipient } = transferRecipient.data;
 
       // console.log("resolve_account_number >> ", resolve_account_number);
 
       return CreateOperationResponse({
         results: transfer_recipient,
         statusCode: 200,
         status: "success",
         label: `paystack transfer recipient`,
         message: "Successfully transfer recipient",
       });
     } catch (error) {
       console.log("error >> ", error.response.data);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `paystack transfer recipient`,
         statusCode: 400,
         message: error.response.data.message || `Unable to transfer recipient`,
       });
     }
   }
   static async transfer(recipient: string, amount: number) {
     try {
       const transfer: any = await axios.post(
         `${paystackConfig["transferEndpoint"]}`,
         {
           source: "balance",
           amount,
           recipient: recipient,
           reason: "Transfer",
           
         },
         {
           headers: {
             authorization: `Bearer ${paystackConfig["secret"]}`,
           },
         }
       );
 
       console.log("transfer >> ", transfer);
 
       const { data: transfer_data } = transfer.data;
 
       // console.log("resolve_account_number >> ", resolve_account_number);
 
       return CreateOperationResponse({
         results: transfer_data,
         statusCode: 200,
         status: "success",
         label: `paystack transfer`,
         message: "Successfully transfer",
       });
     } catch (error) {
       console.log("error >> ", error.response);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `paystack transfer`,
         statusCode: 400,
         message: error.response.data.message || `Unable to transfer`,
       });
     }
   }
 }
 