import type { MobileMoneyAdapter } from "./types";
import { MpesaAdapter } from "./mpesa";
import { MtnMomoAdapter } from "./mtn-momo";

const adapterMap: Record<string, () => MobileMoneyAdapter> = {
  MPESA: () => new MpesaAdapter(),
  MTN_MOMO: () => new MtnMomoAdapter(),
};

export function getMobileMoneyAdapter(
  provider: string
): MobileMoneyAdapter {
  const enabledProviders = (
    process.env.MOBILE_MONEY_PROVIDERS || "MPESA,MTN_MOMO"
  )
    .split(",")
    .map((p) => p.trim());

  if (!enabledProviders.includes(provider)) {
    throw new Error(
      `Mobile money provider "${provider}" is not enabled. Enabled providers: ${enabledProviders.join(", ")}`
    );
  }

  const factory = adapterMap[provider];
  if (!factory) {
    throw new Error(
      `Unknown mobile money provider: ${provider}. Supported providers: ${Object.keys(adapterMap).join(", ")}`
    );
  }

  return factory();
}

export function getEnabledMobileMoneyProviders(): string[] {
  return (process.env.MOBILE_MONEY_PROVIDERS || "MPESA,MTN_MOMO")
    .split(",")
    .map((p) => p.trim())
    .filter((p) => adapterMap[p]);
}

export function getAllAdapters(): { provider: string; adapter: MobileMoneyAdapter }[] {
  const enabledProviders = getEnabledMobileMoneyProviders();
  return enabledProviders.map((provider) => ({
    provider,
    adapter: adapterMap[provider](),
  }));
}
