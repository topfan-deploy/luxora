import { describe, it, expect, vi, beforeEach } from "vitest";
import { MpesaAdapter } from "@/lib/payments/mobile-money/mpesa";

describe("MpesaAdapter", () => {
  const fetchMock = vi.fn();
  global.fetch = fetchMock;

  beforeEach(() => {
    vi.stubEnv("MPESA_CONSUMER_KEY", "test-key");
    vi.stubEnv("MPESA_CONSUMER_SECRET", "test-secret");
    vi.stubEnv("MPESA_SHORTCODE", "174379");
    vi.stubEnv("MPESA_PASSKEY", "testpasskey");
    vi.stubEnv("MPESA_ENVIRONMENT", "sandbox");
    fetchMock.mockReset();
  });

  const sampleInitiation = {
    amount: 1000,
    currency: "KES",
    phoneNumber: "254712345678",
    userId: "user-1",
    orderId: "order-1",
    callbackUrl: "https://example.com/callback",
    reference: "REF001",
  };

  describe("initiatePayment", () => {
    it("should return success when STK push succeeds", async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ access_token: "tok" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ResponseCode: "0",
            CheckoutRequestID: "ws_co_123",
            MerchantRequestID: "mr_123",
            ResponseDescription: "Success",
            CustomerMessage: "Success",
          }),
        });

      const adapter = new MpesaAdapter();
      const result = await adapter.initiatePayment(sampleInitiation);

      expect(result.success).toBe(true);
      expect(result.providerTxId).toBe("ws_co_123");
      expect(result.status).toBe("PENDING");
    });

    it("should return failure when STK push response code is not 0", async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ access_token: "tok" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ResponseCode: "1032",
            CheckoutRequestID: "ws_co_456",
            MerchantRequestID: "mr_456",
            ResponseDescription: "Request cancelled by user",
            CustomerMessage: "Cancelled",
          }),
        });

      const adapter = new MpesaAdapter();
      const result = await adapter.initiatePayment(sampleInitiation);

      expect(result.success).toBe(false);
      expect(result.status).toBe("FAILED");
    });

    it("should handle network errors gracefully", async () => {
      fetchMock.mockRejectedValueOnce(new Error("Network fail"));

      const adapter = new MpesaAdapter();
      const result = await adapter.initiatePayment(sampleInitiation);

      expect(result.success).toBe(false);
      expect(result.status).toBe("FAILED");
      expect(result.error).toContain("Network fail");
    });
  });

  describe("verifyCallback", () => {
    it("should verify a completed callback successfully", async () => {
      const payload = {
        Body: {
          stkCallback: {
            MerchantRequestID: "mr1",
            CheckoutRequestID: "cr1",
            ResultCode: 0,
            ResultDesc: "Success",
            CallbackMetadata: {
              Item: [
                { Name: "MpesaReceiptNumber", Value: "RCPT123" },
                { Name: "Amount", Value: 1000 },
              ],
            },
          },
        },
      };

      const adapter = new MpesaAdapter();
      const result = await adapter.verifyCallback(payload);

      expect(result.verified).toBe(true);
      expect(result.status).toBe("COMPLETED");
      expect(result.providerTxId).toBe("RCPT123");
      expect(result.amount).toBe(1000);
      expect(result.currency).toBe("KES");
    });

    it("should return FAILED status when ResultCode is non-zero", async () => {
      const payload = {
        Body: {
          stkCallback: {
            MerchantRequestID: "mr2",
            CheckoutRequestID: "cr2",
            ResultCode: 1032,
            ResultDesc: "Request cancelled by user",
          },
        },
      };

      const adapter = new MpesaAdapter();
      const result = await adapter.verifyCallback(payload);

      expect(result.verified).toBe(true);
      expect(result.status).toBe("FAILED");
    });

    it("should return verified false when stkCallback is missing", async () => {
      const adapter = new MpesaAdapter();
      const result = await adapter.verifyCallback({});

      expect(result.verified).toBe(false);
      expect(result.status).toBe("FAILED");
      expect(result.providerTxId).toBe("");
    });

    it("should fall back to CheckoutRequestID when MpesaReceiptNumber is absent", async () => {
      const payload = {
        Body: {
          stkCallback: {
            MerchantRequestID: "mr3",
            CheckoutRequestID: "cr3",
            ResultCode: 0,
            ResultDesc: "Success",
            CallbackMetadata: {
              Item: [{ Name: "Amount", Value: 500 }],
            },
          },
        },
      };

      const adapter = new MpesaAdapter();
      const result = await adapter.verifyCallback(payload);

      expect(result.verified).toBe(true);
      expect(result.status).toBe("COMPLETED");
      expect(result.providerTxId).toBe("cr3");
    });
  });
});
