"use client";

import { FALLBACK_INR_PER_CURRENCY, type ExchangeRates } from "lib/money";
import { createContext, useContext, type ReactNode } from "react";

const ExchangeRatesContext = createContext<ExchangeRates>(
  FALLBACK_INR_PER_CURRENCY,
);

export function ExchangeRatesProvider({
  rates,
  children,
}: {
  rates: ExchangeRates;
  children: ReactNode;
}) {
  return (
    <ExchangeRatesContext.Provider value={rates}>
      {children}
    </ExchangeRatesContext.Provider>
  );
}

export function useExchangeRates(): ExchangeRates {
  return useContext(ExchangeRatesContext);
}
