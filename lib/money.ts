import {
  DEFAULT_CURRENCY_MARKET,
  getMarketByCurrency,
  isSupportedCurrencyCode,
  type SupportedCurrencyCode,
} from "lib/currency";

export type ExchangeRates = Record<SupportedCurrencyCode, number>;

// Approximate INR value of one unit of each currency. Used as a fallback when
// live rates can't be fetched (see lib/exchange-rates.ts). Prices are stored in
// INR and converted at display time.
export const FALLBACK_INR_PER_CURRENCY: ExchangeRates = {
  INR: 1,
  USD: 95,
  EUR: 103,
  GBP: 120,
  AED: 26,
  CAD: 70,
  AUD: 63,
  JPY: 0.62,
  SGD: 71,
};

// Currencies conventionally shown without decimal places.
const ZERO_DECIMAL_CURRENCIES = new Set(["INR", "JPY"]);

function getFractionDigits(currencyCode: string) {
  return ZERO_DECIMAL_CURRENCIES.has(currencyCode) ? 0 : 2;
}

function convertMoneyAmount({
  amount,
  fromCurrency,
  toCurrency,
  rates,
}: {
  amount: string | number;
  fromCurrency: string;
  toCurrency: SupportedCurrencyCode;
  rates: ExchangeRates;
}) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) return 0;
  if (fromCurrency === toCurrency) return numericAmount;
  if (!isSupportedCurrencyCode(fromCurrency)) return numericAmount;

  const amountInInr = numericAmount * rates[fromCurrency];
  return amountInInr / rates[toCurrency];
}

export function formatMoney({
  amount,
  currencyCode,
  displayCurrencyCode,
  rates = FALLBACK_INR_PER_CURRENCY,
}: {
  amount: string | number;
  currencyCode: string;
  displayCurrencyCode?: SupportedCurrencyCode;
  rates?: ExchangeRates;
}) {
  const targetCurrency =
    displayCurrencyCode ??
    (isSupportedCurrencyCode(currencyCode)
      ? currencyCode
      : DEFAULT_CURRENCY_MARKET.currencyCode);
  const convertedAmount = convertMoneyAmount({
    amount,
    fromCurrency: currencyCode,
    toCurrency: targetCurrency,
    rates,
  });

  const market = getMarketByCurrency(targetCurrency) ?? DEFAULT_CURRENCY_MARKET;

  return new Intl.NumberFormat(market.locale, {
    style: "currency",
    currency: targetCurrency,
    minimumFractionDigits: getFractionDigits(targetCurrency),
    maximumFractionDigits: getFractionDigits(targetCurrency),
  }).format(convertedAmount);
}
