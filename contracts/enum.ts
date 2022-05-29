
export enum TransactionStatus {
PENDING = "pending",
FAILED = "failed",
ABANDONED = "abandoned",
SUCCESSFUL = "successful"
}

export enum TransactionEntity {
WALLETFUNDING = "walletfunding",
PAYOUTS = "payouts",
WALLETTRANSFERS = "wallettransfers",
WALLETWITHDRAWALS = "walletwithdrawals"
}
export enum TransactionType {
CREDIT = "credit",
DEBIT = "debit",
}

export enum PasswordStatus {
ACTIVE = "active",
INACTIVE = "inactive",
}

export enum UserType {
USER = "user",
ADMIN = "admin",
}
  