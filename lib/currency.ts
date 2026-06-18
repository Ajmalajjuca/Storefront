export const CURRENCY_COUNTRY_COOKIE = "currencyCountry";
export const SHOPIFY_CHECKOUT_COUNTRY = "IN";

export type SupportedCurrencyCode =
  | "INR"
  | "USD"
  | "EUR"
  | "GBP"
  | "AED"
  | "CAD"
  | "AUD"
  | "JPY"
  | "SGD";
export type SupportedCountryCode =
  | "IN"
  | "US"
  | "DE"
  | "GB"
  | "AE"
  | "CA"
  | "AU"
  | "JP"
  | "SG";

export type CurrencyMarket = {
  currencyCode: SupportedCurrencyCode;
  countryCode: SupportedCountryCode;
  label: string;
  locale: string;
};

export const CURRENCY_MARKETS = [
  { currencyCode: "INR", countryCode: "IN", label: "INR", locale: "en-IN" },
  { currencyCode: "USD", countryCode: "US", label: "USD", locale: "en-US" },
  { currencyCode: "EUR", countryCode: "DE", label: "EUR", locale: "de-DE" },
  { currencyCode: "GBP", countryCode: "GB", label: "GBP", locale: "en-GB" },
  { currencyCode: "AED", countryCode: "AE", label: "AED", locale: "en-AE" },
  { currencyCode: "CAD", countryCode: "CA", label: "CAD", locale: "en-CA" },
  { currencyCode: "AUD", countryCode: "AU", label: "AUD", locale: "en-AU" },
  { currencyCode: "JPY", countryCode: "JP", label: "JPY", locale: "ja-JP" },
  { currencyCode: "SGD", countryCode: "SG", label: "SGD", locale: "en-SG" },
] as const satisfies readonly CurrencyMarket[];

export const DEFAULT_CURRENCY_MARKET = CURRENCY_MARKETS[0];

export function isSupportedCountryCode(
  value: string | undefined,
): value is SupportedCountryCode {
  return CURRENCY_MARKETS.some((market) => market.countryCode === value);
}

export function isSupportedCurrencyCode(
  value: string | undefined,
): value is SupportedCurrencyCode {
  return CURRENCY_MARKETS.some((market) => market.currencyCode === value);
}

export function getMarketByCountry(
  countryCode: string | undefined,
): CurrencyMarket {
  return (
    CURRENCY_MARKETS.find((market) => market.countryCode === countryCode) ??
    DEFAULT_CURRENCY_MARKET
  );
}

export function getMarketByCurrencyOrCountry(
  value: string | undefined,
): CurrencyMarket {
  const normalized = value?.toUpperCase();

  return (
    CURRENCY_MARKETS.find(
      (market) =>
        market.currencyCode === normalized || market.countryCode === normalized,
    ) ?? DEFAULT_CURRENCY_MARKET
  );
}

export function getMarketByCurrency(
  currencyCode: string | undefined,
): CurrencyMarket | undefined {
  return CURRENCY_MARKETS.find(
    (market) => market.currencyCode === currencyCode,
  );
}
