import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import { TransactionEntity, TransactionStatus, TransactionType } from "./enum";

export interface IRegistration {
  name: string
  email: string
  password: string
}
export interface ILogin {
  email: string
  password: string
  auth: AuthContract
}
export interface IWalletCreation {
  user_id: number
}
export interface IWalletCredit {
  user_id: number,
  amount: number
}
export interface IDebit {
  user_id: number,
  amount: number,
  reference: string,
  payload?: any,
}
export interface IWalletTransfer {
  email: string,
  amount: number
}
export interface IWalletFunding {
  amount: number,
  reference: string
}
export interface ICreateTransaction {
  user_id: number,
  reference: string,
  amount: number,
  status: TransactionStatus,
  entity: TransactionEntity,
  payload?: string,
  payment_date?: number,
  type: TransactionType
}
export interface IInitializePayment {
  amount: number,
  reference: string
  user_id: number
  email: string
  entity: TransactionEntity
}
export interface IBeneficiaryCreation {
  user_id: number,
  account_number: string
  bank_name: string
  bank_code: string
}
export interface ITransferRecipient {
  type: string,
  name: string
  account_number: string
  bank_code: string
  currency: string
}
export interface IWalletWithdrawal {
  amount: number,
  name: string
  account_number: string
  bank_code: string
}
