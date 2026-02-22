import { v4 as uuidv4 } from "uuid";
import type {
  MobileMoneyAdapter,
  MobileMoneyInitiation,
  MobileMoneyResult,
  MobileMoneyCallbackResult,
} from "./types";

interface MtnAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface MtnCallbackPayload {
  referenceId: string;
  status: string;
  financialTransactionId?: string;
  externalId?: string;
  amount: string;
  currency: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  payerMessage?: string;
  payeeNote?: string;
}

const MTN_STATUS_MAP: Record<string, "COMPLETED" | "FAILED"> = {
  SUCCESSFUL: "COMPLETED",
  FAILED: "FAILED",
  REJECTED: "FAILED",
  TIMEOUT: "FAILED",
  PENDING: "FAILED",
};

export class MtnMomoAdapter implements MobileMoneyAdapter {
  private subscriptionKey: string;
  private apiUser: string;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY || "";
    this.apiUser = process.env.MTN_MOMO_API_USER || "";
    this.apiKey = process.env.MTN_MOMO_API_KEY || "";

    const environment = process.env.MTN_MOMO_ENVIRONMENT || "sandbox";
    this.baseUrl =
      environment === "production"
        ? "https://proxy.momoapi.mtn.com"
        : "https://sandbox.momodeveloper.mtn.com";
  }

  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(
      `${this.apiUser}:${this.apiKey}`
    ).toString("base64");

    const response = await fetch(
      `${this.baseUrl}/collection/token/`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Ocp-Apim-Subscription-Key": this.subscriptionKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`MTN MoMo OAuth failed: ${response.statusText}`);
    }

    const data = (await response.json()) as MtnAccessTokenResponse;
    return data.access_token;
  }

  async initiatePayment(
    initiation: MobileMoneyInitiation
  ): Promise<MobileMoneyResult> {
    try {
      const accessToken = await this.getAccessToken();
      const referenceId = uuidv4();

      const response = await fetch(
        `${this.baseUrl}/collection/v1_0/requesttopay`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Reference-Id": referenceId,
            "X-Target-Environment":
              process.env.MTN_MOMO_ENVIRONMENT || "sandbox",
            "Ocp-Apim-Subscription-Key": this.subscriptionKey,
            "Content-Type": "application/json",
            "X-Callback-Url": initiation.callbackUrl,
          },
          body: JSON.stringify({
            amount: String(Math.ceil(initiation.amount)),
            currency: initiation.currency,
            externalId: initiation.reference,
            payer: {
              partyIdType: "MSISDN",
              partyId: initiation.phoneNumber,
            },
            payerMessage: `Payment for order ${initiation.reference}`,
            payeeNote: `Luxora order ${initiation.reference}`,
          }),
        }
      );

      if (response.status === 202) {
        return {
          success: true,
          providerTxId: referenceId,
          status: "PENDING",
        };
      }

      const errorText = await response.text();
      return {
        success: false,
        status: "FAILED",
        error: `MTN MoMo RequestToPay failed: ${errorText}`,
      };
    } catch (error) {
      return {
        success: false,
        status: "FAILED",
        error:
          error instanceof Error
            ? error.message
            : "MTN MoMo payment initiation failed",
      };
    }
  }

  async verifyCallback(payload: unknown): Promise<MobileMoneyCallbackResult> {
    const callback = payload as MtnCallbackPayload;

    if (!callback || !callback.referenceId) {
      return {
        verified: false,
        status: "FAILED",
        providerTxId: "",
        amount: 0,
        currency: "EUR",
        reference: "",
      };
    }

    const mappedStatus = MTN_STATUS_MAP[callback.status] || "FAILED";

    return {
      verified: true,
      status: mappedStatus,
      providerTxId:
        callback.financialTransactionId || callback.referenceId,
      amount: parseFloat(callback.amount) || 0,
      currency: callback.currency || "EUR",
      reference: callback.externalId || callback.referenceId,
    };
  }
}
