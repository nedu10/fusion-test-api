/**
 * Handle Login Activities
 *
 * @param {Object}
 *
 * @returns {Object}
 */

 import Hash from "@ioc:Adonis/Core/Hash";

 import User from "App/Models/User";
 import CreateOperationResponse from "App/Utilities/CreateOperationResponse";
 import { ILogin } from "Contracts/interface";
 
 export default class LoginService {
   protected data;
   constructor(data) {
     this.data = data;
   }
   static async login(data: ILogin) {
 
     const { email, password, auth } = data
    //  console.log("auth >> ", auth);
 
     try {
       const get_user = await User.query().where("email", email).first();
 
       if (!get_user) {
         return CreateOperationResponse({
           results: null,
           label: `Login`,
           statusCode: 400,
           message: `User does not exist`,
         });
       }
 
       const passwords_match = await Hash.verify(get_user.password, password);
 
       if (!passwords_match) {
         return CreateOperationResponse({
           results: null,
           label: `Hash Comparison/Password Match`,
           statusCode: 400,
           message: `Invalid login credentials. Please try again`,
         });
       }
 
       const token = await auth.use("api").generate(get_user);
 
       return CreateOperationResponse({
         results: {
           token,
           user: get_user,
         },
         label: `LogIn`,
         status: "Success",
         statusCode: 200,
         message: `User successfully logged in`,
       });
     } catch (error) {
       //   console.log("err >> ", error.message);
 
       return CreateOperationResponse({
         results: null,
         error: error,
         label: `LogIn`,
         statusCode: 400,
         message: `Unable to process user login`,
       });
     }
   }
 }
 