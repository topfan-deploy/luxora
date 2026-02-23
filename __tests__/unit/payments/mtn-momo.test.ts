import { describe, it, expect, vi, beforeEach } from "vitest";
import { MtnMomoAdapter } from "@/lib/payments/mobile-money/mtn-momo";

vi.mock("uuid", () => ({ v4: () => "mock-uuid-1234" }));

describe("MtnMomoAdapter", () => {
  const fetchMock = vi.fn();
  global.fetch = fetchMock;

  beforeEach(() => {
    vi.stubEnv("MTN_MOMO_SUBSCRIPTION_KEY", "test-sub-key");
    vi.stubEnv("MTN_MOMO_API_USER", "test-api-user");
    vi.stubEnv("MTN_MOMO_API_KEY", "test-api-key");
    vi.stubEnv("MTN_MOMO_ENVIRONMENT", "sandbox");
    fetchMock.mockReset();
  });

  const sampleInitiation = {
    amount: 5000,
    currency: "UGX",
    phoneNumber: "256700000000",
    userId: "user-1",
    orderId: "order-1",
    callbackUrl: "https://example.com/callback",
    reference: "REF001",
  };

  describe("initiatePayment", () => {
    it("should return success when RequestToPay is accepted (202)", async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            access_token: "tok",
            token_type: "Bearer",
            expires_in: 3600,
          }),
        })
        .mockResolvedValueOnce({
          status: 202,
        });

      const adapter = new MtnMomoAdapter();
      const result = await adapter.initiatePayment(sampleInitiation);

      expect(result.success).toBe(true);
      expect(result.providerTxId).toBe("mock-uuid-1234");
      expect(result.status).toBe("PENDING");
    });

    it("should return failure when RequestToPay returns non-202", async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            access_token: "tok",
            token_type: "Bearer",
            expires_in: 3600,
          }),
        })
        .mockResolvedValueOnce({
          status: 400,
          text: async () => "Bad Request",
        });

      const adapter = new MtnMomoAdapter();
      const result = await adapter.initiatePayment(sampleInitiation);

      expect(result.success).toBe(false);
      expect(result.status).toBe("FAILED");
      expect(result.error).toContain("RequestToPay failed");
    });

    it("should handle network errors gracefully", async () => {
      fetchMock.mockRejectedValueOnce(new Error("Connection refused"));

      const adapter = new MtnMomoAdapter();
      const result = await adapter.initiatePayment(sampleInitiation);

      expect(result.success).toBe(false);
      expect(result.status).toBe("FAILED");
    });
  });

  describe("verifyCallback", () => {
    it("should map SUCCESSFUL status to COMPLETED", async () => {
      const payload = {
        referenceId: "ref1",
        status: "SUCCESSFUL",
        financialTransactionId: "ft1",
        externalId: "ext1",
        amount: "5000",
        currency: "UGX",
        payer: {
          partyIdType: "MSISDN",
          partyId: "256700000000",
        },
      };

      const adapter = new MtnMomoAdapter();
      const result = await adapter.verifyCallback(payload);

      expect(result.verified).toBe(true);
      expect(result.status).toBe("COMPLETED");
      expect(result.providerTxId).toBe("ft1");
      expect(result.amount).toBe(5000);
      expect(result.currency).toBe("UGX");
      expect(result.reference).toBe("ext1");
    });

    it("should map FAILED status to FAILED", async () => {
      const payload = {
        referenceId: "ref2",
        status: "FAILED",
        amount: "1000",
        currency: "UGX",
        payer: { partyIdType: "MSISDN", partyId: "256700000000" },
      };

      const adapter = new MtnMomoAdapter();
      const result = await adapter.verifyCallback(payload);

      expect(result.verified).toBe(true);
      expect(result.status).toBe("FAILED");
    });

    it("should map REJECTED status to FAILED", async () => {
      const payload = {
        referenceId: "ref3",
        status: "REJECTED",
        amount: "2000",
        currency: "UGX",
        payer: { partyIdType: "MSISDN", partyId: "256700000000" },
      };

      const adapter = new MtnMomoAdapter();
      const result = await adapter.verifyCallback(payload);

      expect(result.verified).toBe(true);
      expect(result.status).toBe("FAILED");
    });

    it("should map TIMEOUT status to FAILED", async () => {
      const payload = {
        referenceId: "ref4",
        status: "TIMEOUT",
        amount: "3000",
        currency: "UGX",
        payer: { partyIdType: "MSISDN", partyId: "256700000000" },
      };

      const adapter = new MtnMomoAdapter();
      const result = await adapter.verifyCallback(payload);

      expect(result.verified).toBe(true);
      expect(result.status).toBe("FAILED");
    });

    it("should return verified false when referenceId is missing", async () => {
      const adapter = new MtnMomoAdapter();
      const result = await adapter.verifyCallback(null);

      expect(result.verified).toBe(false);
      expect(result.status).toBe("FAILED");
      expect(result.providerTxId).toBe("");
      expect(result.amount).toBe(0);
      expect(result.currency).toBe("EUR");
    });

    it("should default to FAILED for unknown status values", async () => {
      const payload = {
        referenceId: "ref5",
        status: "UNKNOWN_STATUS",
        amount: "4000",
        currency: "UGX",
        payer: { partyIdType: "MSISDN", partyId: "256700000000" },
      };

      const adapter = new MtnMomoAdapter();
      const result = await adapter.verifyCallback(payload);

      expect(result.verified).toBe(true);
      expect(result.status).toBe("FAILED");
    });
  });
});
