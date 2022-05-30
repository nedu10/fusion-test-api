/**
 * Handle User Activities
 *
 * @param {Object}
 *
 * @returns {Object}
 */

 import Hash from "@ioc:Adonis/Core/Hash";

 import User from "App/Models/User";
 import CreateOperationResponse from "App/Utilities/CreateOperationResponse";
 import { ILogin } from "Contracts/interface";
 
 export default class UserService {
   protected data;
   constructor(data) {
     this.data = data;
   }
   static async profile(user_id: any) {
 
     try {
        
       const get_user = await User.query().where("id", user_id).preload("wallet");
 
       if (!get_user) {
         return CreateOperationResponse({
           results: null,
           label: `Profile`,
           statusCode: 400,
           message: `User does not exist`,
         });
       }
 
       return CreateOperationResponse({
         results: {...get_user},
         label: `Profile`,
         status: "Success",
         statusCode: 200,
         message: `User successfully profile`,
       });
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Profile`,
         statusCode: 400,
         message: `Unable to process user profile`,
       });
     }
   }
 }
 