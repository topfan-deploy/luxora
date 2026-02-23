import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getMobileMoneyAdapter,
  getEnabledMobileMoneyProviders,
  getAllAdapters,
} from "@/lib/payments/mobile-money/adapter";

describe("Mobile Money Adapter Module", () => {
  beforeEach(() => {
    vi.stubEnv("MPESA_CONSUMER_KEY", "test-key");
    vi.stubEnv("MPESA_CONSUMER_SECRET", "test-secret");
    vi.stubEnv("MPESA_SHORTCODE", "174379");
    vi.stubEnv("MPESA_PASSKEY", "testpasskey");
    vi.stubEnv("MPESA_ENVIRONMENT", "sandbox");
    vi.stubEnv("MTN_MOMO_SUBSCRIPTION_KEY", "test-sub-key");
    vi.stubEnv("MTN_MOMO_API_USER", "test-api-user");
    vi.stubEnv("MTN_MOMO_API_KEY", "test-api-key");
    vi.stubEnv("MTN_MOMO_ENVIRONMENT", "sandbox");
    vi.unstubAllEnvs();
    vi.stubEnv("MPESA_CONSUMER_KEY", "test-key");
    vi.stubEnv("MPESA_CONSUMER_SECRET", "test-secret");
    vi.stubEnv("MPESA_SHORTCODE", "174379");
    vi.stubEnv("MPESA_PASSKEY", "testpasskey");
    vi.stubEnv("MPESA_ENVIRONMENT", "sandbox");
    vi.stubEnv("MTN_MOMO_SUBSCRIPTION_KEY", "test-sub-key");
    vi.stubEnv("MTN_MOMO_API_USER", "test-api-user");
    vi.stubEnv("MTN_MOMO_API_KEY", "test-api-key");
    vi.stubEnv("MTN_MOMO_ENVIRONMENT", "sandbox");
  });

  describe("getMobileMoneyAdapter", () => {
    it("should return an MPESA adapter", () => {
      const adapter = getMobileMoneyAdapter("MPESA");
      expect(adapter).toBeDefined();
      expect(typeof adapter.initiatePayment).toBe("function");
      expect(typeof adapter.verifyCallback).toBe("function");
    });

    it("should return an MTN_MOMO adapter", () => {
      const adapter = getMobileMoneyAdapter("MTN_MOMO");
      expect(adapter).toBeDefined();
      expect(typeof adapter.initiatePayment).toBe("function");
      expect(typeof adapter.verifyCallback).toBe("function");
    });

    it("should throw for an unknown provider", () => {
      expect(() => getMobileMoneyAdapter("UNKNOWN")).toThrow(
        "is not enabled"
      );
    });

    it("should throw when provider is not enabled", () => {
      vi.stubEnv("MOBILE_MONEY_PROVIDERS", "MPESA");

      expect(() => getMobileMoneyAdapter("MTN_MOMO")).toThrow("not enabled");
    });
  });

  describe("getEnabledMobileMoneyProviders", () => {
    it("should return default providers when env is not set", () => {
      const providers = getEnabledMobileMoneyProviders();
      expect(providers).toEqual(["MPESA", "MTN_MOMO"]);
    });

    it("should return only the configured providers", () => {
      vi.stubEnv("MOBILE_MONEY_PROVIDERS", "MPESA");

      const providers = getEnabledMobileMoneyProviders();
      expect(providers).toEqual(["MPESA"]);
    });

    it("should filter out invalid provider names", () => {
      vi.stubEnv("MOBILE_MONEY_PROVIDERS", "MPESA,INVALID");

      const providers = getEnabledMobileMoneyProviders();
      expect(providers).toEqual(["MPESA"]);
    });
  });

  describe("getAllAdapters", () => {
    it("should return adapters for all default enabled providers", () => {
      const adapters = getAllAdapters();

      expect(adapters).toHaveLength(2);

      const providerNames = adapters.map((a) => a.provider);
      expect(providerNames).toContain("MPESA");
      expect(providerNames).toContain("MTN_MOMO");

      for (const entry of adapters) {
        expect(entry.adapter).toBeDefined();
        expect(typeof entry.adapter.initiatePayment).toBe("function");
        expect(typeof entry.adapter.verifyCallback).toBe("function");
      }
    });
  });
});
