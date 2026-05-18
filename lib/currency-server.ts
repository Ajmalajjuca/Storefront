import {
  CURRENCY_COUNTRY_COOKIE,
  DEFAULT_CURRENCY_MARKET,
  getMarketByCurrencyOrCountry,
  isSupportedCountryCode,
  type SupportedCountryCode,
} from "lib/currency";
import { cookies } from "next/headers";


export async function getSelectedCountryCode(
  currencyOrCountry?: string,
): Promise<SupportedCountryCode> {
  if (currencyOrCountry) {
    return getMarketByCurrencyOrCountry(currencyOrCountry).countryCode;
  }

  const countryCode = (await cookies()).get(CURRENCY_COUNTRY_COOKIE)?.value;
  return isSupportedCountryCode(countryCode)
    ? countryCode
    : DEFAULT_CURRENCY_MARKET.countryCode;
}
