import type {
  MobileMoneyAdapter,
  MobileMoneyInitiation,
  MobileMoneyResult,
  MobileMoneyCallbackResult,
} from "./types";

interface MpesaAccessTokenResponse {
  access_token: string;
  expires_in: string;
}

interface MpesaStkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface MpesaCallbackItem {
  Name: string;
  Value: string | number;
}

interface MpesaCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: MpesaCallbackItem[];
      };
    };
  };
}

export class MpesaAdapter implements MobileMoneyAdapter {
  private consumerKey: string;
  private consumerSecret: string;
  private shortcode: string;
  private passkey: string;
  private baseUrl: string;

  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY || "";
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET || "";
    this.shortcode = process.env.MPESA_SHORTCODE || "";
    this.passkey = process.env.MPESA_PASSKEY || "";

    const environment = process.env.MPESA_ENVIRONMENT || "sandbox";
    this.baseUrl =
      environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";
  }

  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`
    ).toString("base64");

    const response = await fetch(
      `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`M-Pesa OAuth failed: ${response.statusText}`);
    }

    const data = (await response.json()) as MpesaAccessTokenResponse;
    return data.access_token;
  }

  private getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  private generatePassword(timestamp: string): string {
    return Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString(
      "base64"
    );
  }

  async initiatePayment(
    initiation: MobileMoneyInitiation
  ): Promise<MobileMoneyResult> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword(timestamp);

      const response = await fetch(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            BusinessShortCode: this.shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.ceil(initiation.amount),
            PartyA: initiation.phoneNumber,
            PartyB: this.shortcode,
            PhoneNumber: initiation.phoneNumber,
            CallBackURL: initiation.callbackUrl,
            AccountReference: initiation.reference,
            TransactionDesc: `Payment for order ${initiation.reference}`,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`M-Pesa STK Push failed: ${errorText}`);
      }

      const data = (await response.json()) as MpesaStkPushResponse;

      if (data.ResponseCode === "0") {
        return {
          success: true,
          providerTxId: data.CheckoutRequestID,
          status: "PENDING",
        };
      }

      return {
        success: false,
        status: "FAILED",
        error: data.ResponseDescription || "STK Push request failed",
      };
    } catch (error) {
      return {
        success: false,
        status: "FAILED",
        error:
          error instanceof Error ? error.message : "M-Pesa payment initiation failed",
      };
    }
  }

  async verifyCallback(payload: unknown): Promise<MobileMoneyCallbackResult> {
    const callback = payload as MpesaCallbackBody;
    const stkCallback = callback?.Body?.stkCallback;

    if (!stkCallback) {
      return {
        verified: false,
        status: "FAILED",
        providerTxId: "",
        amount: 0,
        currency: "KES",
        reference: "",
      };
    }

    const isSuccess = stkCallback.ResultCode === 0;
    let mpesaReceiptNumber = "";
    let amount = 0;

    if (isSuccess && stkCallback.CallbackMetadata?.Item) {
      for (const item of stkCallback.CallbackMetadata.Item) {
        if (item.Name === "MpesaReceiptNumber") {
          mpesaReceiptNumber = String(item.Value);
        }
        if (item.Name === "Amount") {
          amount = Number(item.Value);
        }
      }
    }

    return {
      verified: true,
      status: isSuccess ? "COMPLETED" : "FAILED",
      providerTxId: mpesaReceiptNumber || stkCallback.CheckoutRequestID,
      amount,
      currency: "KES",
      reference: stkCallback.MerchantRequestID,
    };
  }
}
