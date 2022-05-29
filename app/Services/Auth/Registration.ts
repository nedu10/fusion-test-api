/**
 * Handle Registration Activities
 *
 * @param {Object}
 *
 * @returns {Object}
 */

 import User from "App/Models/User";
import CreateOperationResponse from "App/Utilities/CreateOperationResponse";
 import { IRegistration } from "Contracts/interface";
 
 export default class RegistrationService {
   protected data;
   constructor(data) {
     this.data = data;
   }
   static async register(data: IRegistration) {
     const {
       name,
       email,
       password,
     } = data;
 
     try {
       const new_user = await User.create({
         name,
         email,
         password,
       });
 
       return CreateOperationResponse({
         results: new_user,
         label: `Sign up`,
         status: "Success",
         statusCode: 200,
         message: `User successfully registered`,
       });
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `Sign up`,
         statusCode: 400,
         message: `Unable to process user sign up`,
       });
     }
   }
 }
 