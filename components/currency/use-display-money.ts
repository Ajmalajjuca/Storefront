"use client";

import { useCurrencyPreference } from "components/currency/currency-preference-context";
import {
  getMarketByCurrencyOrCountry,
  isSupportedCurrencyCode,
  type SupportedCurrencyCode,
} from "lib/currency";
import { formatMoney } from "lib/money";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useExchangeRates } from "./exchange-rates-context";

function getCurrencyFromSearchParam(
  value: string | null,
): SupportedCurrencyCode | undefined {
  if (!value) return undefined;

  const normalized = value.toUpperCase();
  if (isSupportedCurrencyCode(normalized)) return normalized;

  return getMarketByCurrencyOrCountry(normalized).currencyCode;
}

export function useDisplayMoney() {
  const searchParams = useSearchParams();
  const { activeMarket, setCountryCode } = useCurrencyPreference();
  const rates = useExchangeRates();
  const currencyParam = searchParams.get("currency");
  const displayCurrencyCode = useMemo(
    () =>
      getCurrencyFromSearchParam(currencyParam) ?? activeMarket.currencyCode,
    [activeMarket.currencyCode, currencyParam],
  );

  useEffect(() => {
    if (!currencyParam) return;

    setCountryCode(getMarketByCurrencyOrCountry(currencyParam).countryCode);
  }, [currencyParam, setCountryCode]);

  return useCallback(
    (amount: string | number, currencyCode: string) =>
      formatMoney({ amount, currencyCode, displayCurrencyCode, rates }),
    [displayCurrencyCode, rates],
  );
}
