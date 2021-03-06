/**
 * Handle wallet management Activities
 *
 * @param {Object}
 *
 * @returns {Object}
 */

 import Database from "@ioc:Adonis/Lucid/Database";
import Transaction from "App/Models/Transaction";
import User from "App/Models/User";
 import Wallet from "App/Models/Wallet";
 import CreateOperationResponse from "App/Utilities/CreateOperationResponse";
 import {
   TransactionEntity,
   TransactionStatus,
   TransactionType,
 } from "Contracts/enum";
 import {
   IDebit,
   IWalletCreation,
   IWalletCredit,
   IWalletFunding,
   IWalletTransfer,
   IWalletWithdrawal,
 } from "Contracts/interface";
import PaymentService from "../Payment/PaymentMangement";
import PaystackService from "../Payment/Paystack";
//  import PaymentService from "../Payment/PaymentManagement";
//  import PaystackService from "../Payment/Paystack";
 
 export default class WalletService {
   protected data;
   constructor(data) {
     this.data = data;
   }
   static async create_wallet(data: IWalletCreation) {
     const { user_id } = data;
 
     try {
       await Wallet.create({
         user_id,
       });
 
       return CreateOperationResponse({
         results: {},
         label: `Create Wallet`,
         status: "Success",
         statusCode: 200,
         message: `Wallet successfully created`,
       });
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Create Wallet`,
         statusCode: 400,
         message: `Unable to process create wallet`,
       });
     }
   }
   static async credit(data: IWalletCredit) {
     const { user_id, amount } = data;
 
     try {

       const get_wallet = (await Wallet.query()
         .where("user_id", user_id)
         .first()) as Wallet;

       if (!get_wallet) {
         return CreateOperationResponse({
           results: get_wallet,
           error: { message: "User does not heve a wallet", status: "failed" },
           label: `Wallet Transfer`,
           statusCode: 400,
           message: `User does not heve a wallet`,
         });
       }
       
 
       get_wallet.amount = Number(get_wallet.amount) + Number(amount);
 
       await get_wallet.save();
 
       return CreateOperationResponse({
         results: {},
         label: `Credit Wallet`,
         status: "Success",
         statusCode: 200,
         message: `Wallet successfully credited`,
       });
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Credit Wallet`,
         statusCode: 400,
         message: `Unable to process credit wallet`,
       });
     }
   }
 
   static async transfer_money(data: IWalletTransfer, user: User) {
     const { email, amount } = data;
 
     try {
       if (data.email == user.email) {
        return CreateOperationResponse({
          results: {},
          error: { message: "You can't transfer to your account", status: "failed" },
          label: `Transfer Money`,
          statusCode: 400,
          message: `You can't transfer to your account`,
        });
       }

       const get_user_wallet = (await Wallet.query()
         .where("user_id", user.id)
         .first()) as Wallet;
 
       const get_reciever = (await User.query()
         .where("email", email)
         .first()) as User;
 
       const get_reciever_wallet = (await Wallet.query()
         .where("id", get_reciever.id)
         .first()) as Wallet;
 
       if (Number(get_user_wallet.amount) < Number(amount)) {
         return CreateOperationResponse({
           results: get_user_wallet,
           error: { message: "insufficient balance", status: "failed" },
           label: `Wallet Transfer`,
           statusCode: 400,
           message: `insufficient balance`,
         });
       }
 
       get_user_wallet.amount = Number(get_user_wallet.amount) - Number(amount);
 
       await get_user_wallet.save();
 
       const generate_reference: any =
         await PaystackService.generate_reference();
 
       if (generate_reference.status_code !== 200) {
         return generate_reference;
       }
 
       const create_user_tranx = await PaymentService.create_transaction({
         entity: TransactionEntity.WALLETTRANSFERS,
         status: TransactionStatus.SUCCESSFUL,
         user_id: user.id,
         amount,
         payload: "",
         payment_date: Date.now(),
         reference: generate_reference?.reference,
         type: TransactionType.DEBIT,
       });
 
       if (create_user_tranx.status_code !== 200) {
         return create_user_tranx;
       }
 
       get_reciever_wallet.amount =
         Number(get_reciever_wallet.amount) + Number(amount);
 
       await get_reciever_wallet.save();
 
       const generate_reference2: any =
         await PaystackService.generate_reference();
 
       if (generate_reference2.status_code !== 200) {
         return generate_reference2;
       }
 
       const create_reciever_tranx = await PaymentService.create_transaction({
         entity: TransactionEntity.WALLETTRANSFERS,
         status: TransactionStatus.SUCCESSFUL,
         user_id: get_reciever_wallet.user_id,
         amount,
         payload: "",
         payment_date: Date.now(),
         reference: generate_reference2?.reference,
         type: TransactionType.CREDIT,
       });
 
       if (create_reciever_tranx.status_code !== 200) {
         return create_reciever_tranx;
       }
 
       return CreateOperationResponse({
         results: {},
         label: `Credit Wallet`,
         status: "Success",
         statusCode: 200,
         message: `Successfully transfered funds`,
       });
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Credit Wallet`,
         statusCode: 400,
         message: `Unable to process credit wallet`,
       });
     }
   }

   static async debit(data: IDebit){
     try {
      const get_user_wallet = (await Wallet.query()
        .where("user_id", data.user_id)
        .first()) as Wallet;

      if (get_user_wallet && get_user_wallet.amount < data.amount) {
        return CreateOperationResponse({
          error: { message: "Insufficient funds", status: "Failed" },
          results: null,
          label: `Wallet debit`,
          statusCode: 400,
          message: `Insufficient funds`,
        });
      }
      if (!get_user_wallet) {
        return CreateOperationResponse({
          error: { message: "User does not have a wallet", status: "Failed" },
          results: null,
          label: `Wallet debit`,
          statusCode: 400,
          message: `User does not have a wallet`,
        });
      }

      get_user_wallet.amount = Number(get_user_wallet.amount) - Number(data.amount);

      await get_user_wallet.save();

      const create_tranx = await PaymentService.create_transaction({
        entity: TransactionEntity.WALLETWITHDRAWALS,
        status: TransactionStatus.SUCCESSFUL,
        user_id: data.user_id,
        amount: data.amount,
        payload: JSON.stringify(data.payload),
        payment_date: Date.now(),
        reference: data.reference,
        type: TransactionType.DEBIT,
      });

      if (create_tranx.status_code !== 200) {
        return create_tranx;
      }

      return CreateOperationResponse({
        results: {create_tranx},
        label: `Debit Wallet`,
        status: "Success",
        statusCode: 200,
        message: `Successfully transfered funds`,
      });
     } catch (error) {
        return CreateOperationResponse({
          results: null,
          error: error,
          label: `Debit Wallet`,
          statusCode: 400,
          message: `Unable to process debit wallet`,
        });
     }
   }
 
   static async wallet_withdrawal(data: IWalletWithdrawal, user: User) {
     
     try {
      const get_user_wallet = (await Wallet.query()
        .where("user_id", user.id)
        .first()) as Wallet;

      if (get_user_wallet && get_user_wallet.amount < data.amount) {
        return CreateOperationResponse({
          error: { message: "Insufficient funds", status: "Failed" },
          results: null,
          label: `Wallet withdrawal`,
          statusCode: 400,
          message: `Insufficient funds`,
        });
      }
      if (!get_user_wallet) {
        return CreateOperationResponse({
          error: { message: "User does not have a wallet", status: "Failed" },
          results: null,
          label: `Wallet withdrawal`,
          statusCode: 400,
          message: `User does not have a wallet`,
        });
      }

       const create_recipient = await PaystackService.transfer_recipient({
         type: "nuban",
         name: data.name,
         account_number: data.account_number,
         bank_code: data.bank_code,
         currency: "NGN"
       }, user.id);
 
       if (create_recipient.status_code !== 200) {
         return create_recipient;
       }
 
      //  console.log("create_recipient >> ", create_recipient);
 
      //  console.log(create_recipient.results.recipient_code, data.amount);
 
 
       const create_transfer = await PaystackService.transfer(
         create_recipient.results.recipient_code,
         data.amount
       );
 
       if (create_transfer.status_code !== 200) {
         return create_transfer;
       }

       const payload = create_transfer.results

       if (payload.status == "success") {
         await WalletService.debit({
          reference: payload.reference,
          amount: payload.amount/100,
          user_id: user.id,
          payload
         })
       }
 
      //  console.log("create_transfer >> ", create_transfer);
 
       return CreateOperationResponse({
         results: {},
         label: `Transfer recipient`,
         status: "Success",
         statusCode: 200,
         message: `successfully transfer recipient`,
       });
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Transfer recipient`,
         statusCode: 400,
         message: `Unable to process transfer recipient`,
       });
     }
   }
 }
 