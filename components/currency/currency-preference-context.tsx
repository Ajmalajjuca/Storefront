"use client";

import {
  DEFAULT_CURRENCY_MARKET,
  getMarketByCountry,
  isSupportedCountryCode,
  type CurrencyMarket,
  type SupportedCountryCode,
} from "lib/currency";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CurrencyPreferenceContextValue = {
  activeMarket: CurrencyMarket;
  setCountryCode: (countryCode: SupportedCountryCode) => void;
};

const CurrencyPreferenceContext =
  createContext<CurrencyPreferenceContextValue | null>(null);

type Props = {
  children: ReactNode;
  initialMarket?: CurrencyMarket;
};

export function CurrencyPreferenceProvider({
  children,
  initialMarket = DEFAULT_CURRENCY_MARKET,
}: Props) {
  const [countryCode, setCountryCodeState] = useState<SupportedCountryCode>(
    initialMarket.countryCode,
  );

  useEffect(() => {
    setCountryCodeState(initialMarket.countryCode);
  }, [initialMarket.countryCode]);

  const setCountryCode = useCallback(
    (nextCountryCode: SupportedCountryCode) => {
      if (isSupportedCountryCode(nextCountryCode)) {
        setCountryCodeState(nextCountryCode);
      }
    },
    [],
  );

  const value = useMemo<CurrencyPreferenceContextValue>(() => {
    return {
      activeMarket: getMarketByCountry(countryCode),
      setCountryCode,
    };
  }, [countryCode, setCountryCode]);

  return (
    <CurrencyPreferenceContext.Provider value={value}>
      {children}
    </CurrencyPreferenceContext.Provider>
  );
}

export function useCurrencyPreference() {
  const context = useContext(CurrencyPreferenceContext);

  if (!context) {
    return {
      activeMarket: DEFAULT_CURRENCY_MARKET,
      setCountryCode: () => {},
    };
  }

  return context;
}
