/**
 * Handle Payment Activities
 *
 * @param {Object}
 *
 * @returns {Object}
 */

 import Transaction from "App/Models/Transaction";
 import User from "App/Models/User";
 import Wallet from "App/Models/Wallet";
 import CreateOperationResponse from "App/Utilities/CreateOperationResponse";
 import { TransactionEntity, TransactionStatus, TransactionType } from "Contracts/enum";
 import { ICreateTransaction, IWalletFunding } from "Contracts/interface";
 import WalletService from "../Account/WalletManagement";
 import PaystackService from "./Paystack";
 
 export default class PaymentService {
   static async initiate_payment(data: IWalletFunding, user: User) {
     const { amount, reference } = data;
 
     const payload = {
       email: user.email,
       amount,
       user_id: user.id,
       entity: TransactionEntity.WALLETFUNDING,
       reference,
     };
 
     const process_initial_payment = await PaystackService.initialize_payment(
       payload
     );
 
     // console.log(" process_initial_payment >> ", process_initial_payment);
 
     return process_initial_payment;
   }
 
   static async verify_payment(reference: string) {
 
     try {
       const process_verify_payment = await PaystackService.verify_payment(
         reference
       );
 
       console.log("process_verify_payment >> ", process_verify_payment);
 
       if (process_verify_payment.status_code != 200) {
         return process_verify_payment;
       }
 
       const {
         // channel,
         metadata,
         // authorization,
         // customer,
         amount,
         // reference: payment_reference,
         // currency,
         // ip_address,
       } = process_verify_payment.results.data;
 
       console.log("amount >> ", amount, reference, metadata);
 
       const payment_exists = await Transaction.query()
         .where("status", TransactionStatus.PENDING)
         .andWhere("reference", reference)
         .andWhere("amount", amount / 100)
         .first();
 
       //   console.log("payment_exists >> ", payment_exists.toJSON());
 
       if (!payment_exists) {
         return CreateOperationResponse({
           error: { message: "Payment Does Not Exist", status: "Failed" },
           results: null,
           label: `Verify Payment`,
           statusCode: 400,
           message: `Unable to find this payment`,
         });
       }
 
       const credit = await WalletService.credit({
         user_id: metadata.user_id,
         amount: amount / 100,
       });
 
       if (credit.status_code != 200) {
         return credit;
       }
 
       payment_exists.payment_date = Date.now();
       payment_exists.status = TransactionStatus.SUCCESSFUL;
       payment_exists.amount = amount / 100;
       payment_exists.payload = JSON.stringify(
         process_verify_payment.results.data
       );
 
       await payment_exists.save();
       return CreateOperationResponse({
         results: { ...credit.results, metadata },
         status: "Success",
         label: "Payment Verified",
         statusCode: 200,
         message: `Successfully credited`,
       });
     } catch (error) {
       // console.log(error);
       return CreateOperationResponse({
         error: error,
         status: "Error",
         statusCode: 500,
         label: "Payment Verified",
         results: null,
         message: `Error in processing verify payment`,
       });
     }
   }
   static async create_transaction(data: ICreateTransaction) {
     // console.log(user);
 
     try {
       const createTransaction = await Transaction.create({ ...data });
       return CreateOperationResponse({
         results: createTransaction,
         status: "Success",
         label: "transaction creation",
         statusCode: 200,
         message: `Successfully created`,
       });
     } catch (error) {
       // console.log(error);
       return CreateOperationResponse({
         error: error,
         status: "Error",
         statusCode: 500,
         label: "Transaction creation",
         results: null,
         message: `Error in processing transaction creation`,
       });
     }
   }
   static async fetch_transactions(user: User) {
 
        try {
            const get_transactions = await Transaction.query().where(
                "user_id",
                user.id
            );
        
            return CreateOperationResponse({
                results: get_transactions,
                status: "Success",
                label: "Fetch transactions",
                statusCode: 200,
                message: `Successfully fetched transaction`,
            });
        } catch (error) {
            // console.log(error);
            return CreateOperationResponse({
                error: error,
                status: "Error",
                statusCode: 500,
                label: "Fetch transactions",
                results: null,
                message: `Error in processing fetch transaction`,
            });
        }
   }
   static async fetch_single_transaction(transaction_id: number, user: User) {
        console.log(transaction_id, user.id);
    
        try {
        const get_transactions = await Transaction.query()
            .where("user_id", user.id)
            .andWhere("id", transaction_id)
            .first();

        if (!get_transactions) {
            return CreateOperationResponse({
                error: { message: "Transaction Does Not Exist", status: "Failed" },
                results: null,
                label: `Fetch transaction`,
                statusCode: 400,
                message: `Unable to find this transaction`,
            });
        }
    
        return CreateOperationResponse({
            results: get_transactions,
            status: "Success",
            label: "Fetch transactions",
            statusCode: 200,
            message: `Successfully fetched transaction`,
        });
        } catch (error) {
        // console.log(error);
        return CreateOperationResponse({
            error: error,
            status: "Error",
            statusCode: 500,
            label: "Fetch transactions",
            results: null,
            message: `Error in processing fetch transaction`,
        });
        }
   }
   static async webhook(request) {
     try {
       // console.log("request >> ", request.body());
 
       const data = request.body();
 
       switch (data) {
         case "charge.success":
           const { data: event_data } = data;
           const {
             amount,
             reasons,
             reference,
             status,
             created_at,
             updated_at,
             transfer_code,
             recipient: {
               currency,
               metadata,
               name,
               type,
               recipient_code,
               details,
             },
           } = event_data;
 
           const trnx_payload = {
             currency,
             name,
             type,
             recipient_code,
             transfer_code,
             details,
             updated_at,
             created_at,
             status,
             reasons,
           };
 
           const get_user_wallet = (await Wallet.query()
             .where("user_id", metadata.user_id)
             .first()) as Wallet;
 
           get_user_wallet.amount = Number(get_user_wallet.amount) - Number(amount);
 
           await get_user_wallet.save();
 
           await Transaction.create({
             type: TransactionType.DEBIT,
             amount,
             reference,
             entity: TransactionEntity.WALLETWITHDRAWALS,
             status: TransactionStatus.SUCCESSFUL,
             user_id: metadata.user_id,
             payment_date: Date.now(),
             payload: JSON.stringify(trnx_payload),
           });
 
           break;
         // case "transfer.success":
         //   // Webhook to check if transaction is not verified.
         //   break;
 
         default:
           break;
       }
     } catch (error) {
       console.log(error);
     }
   }
 }
 