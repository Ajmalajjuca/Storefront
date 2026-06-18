import { CURRENCY_MARKETS, type SupportedCurrencyCode } from "lib/currency";
import { FALLBACK_INR_PER_CURRENCY, type ExchangeRates } from "lib/money";
import { cacheLife } from "next/cache";

// Free, no-key endpoint (open.er-api.com). Base is INR, so each rate is the
// amount of foreign currency you get for 1 INR; we invert it to store "INR per
// unit", which is what lib/money.ts converts with.
const RATES_ENDPOINT = "https://open.er-api.com/v6/latest/INR";

type ErApiResponse = {
  result?: string;
  rates?: Record<string, number>;
};

/**
 * Live INR-per-currency exchange rates, cached and revalidated hourly. Any
 * network/parse failure (or a missing currency in the response) silently falls
 * back to the static table in lib/money.ts, so prices always render.
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(RATES_ENDPOINT);
    if (!res.ok) return FALLBACK_INR_PER_CURRENCY;

    const data = (await res.json()) as ErApiResponse;
    if (data.result !== "success" || !data.rates) {
      return FALLBACK_INR_PER_CURRENCY;
    }

    const rates = { ...FALLBACK_INR_PER_CURRENCY };
    for (const market of CURRENCY_MARKETS) {
      const code = market.currencyCode as SupportedCurrencyCode;
      const perInr = data.rates[code];
      // perInr = foreign units per 1 INR → invert to INR per 1 foreign unit.
      if (typeof perInr === "number" && perInr > 0) {
        rates[code] = 1 / perInr;
      }
    }

    return rates;
  } catch {
    return FALLBACK_INR_PER_CURRENCY;
  }
}
