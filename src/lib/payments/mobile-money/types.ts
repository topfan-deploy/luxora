export interface MobileMoneyInitiation {
  amount: number;
  currency: string;
  phoneNumber: string;
  userId: string;
  orderId: string;
  callbackUrl: string;
  reference: string;
}

export interface MobileMoneyResult {
  success: boolean;
  providerTxId?: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  error?: string;
}

export interface MobileMoneyCallbackResult {
  verified: boolean;
  status: "COMPLETED" | "FAILED";
  providerTxId: string;
  amount: number;
  currency: string;
  reference: string;
}

export interface MobileMoneyAdapter {
  initiatePayment(initiation: MobileMoneyInitiation): Promise<MobileMoneyResult>;
  verifyCallback(payload: unknown): Promise<MobileMoneyCallbackResult>;
}
