import { CartProvider } from "components/cart/cart-context";
import { CurrencyPreferenceProvider } from "components/currency/currency-preference-context";
import { ExchangeRatesProvider } from "components/currency/exchange-rates-context";
import { SiteShell } from "components/site-shell";
import { WishlistProvider } from "components/wishlist/wishlist-context";
import { CUSTOMER_ACCOUNT_PROFILE_URL } from "lib/constants";
import { CURRENCY_COUNTRY_COOKIE, getMarketByCountry } from "lib/currency";
import { getExchangeRates } from "lib/exchange-rates";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { cookies } from "next/headers";
import { ReactNode, Suspense } from "react";
import "./globals.css";

const SITE_NAME = process.env.SITE_NAME || "BLCKOLE";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  robots: { follow: true, index: true },
};

const leftNavItems = [
  { title: "ENTRY", href: "/" },
  { title: "COLLECTIONS", href: "/indexes/products" },
  { title: "STORY", href: "/story" },
  {
    title: "INSTAGRAM",
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/",
  },
  {
    title: "REDDIT",
    href: process.env.NEXT_PUBLIC_REDDIT_URL || "https://www.reddit.com/",
  },
];

const rightNavItems = [
  { title: "ACCOUNT", href: CUSTOMER_ACCOUNT_PROFILE_URL },
];

async function StorefrontProviders({ children }: { children: ReactNode }) {
  // Cookie-backed request data must resolve inside the Suspense boundary in
  // RootLayout when Cache Components are enabled.
  const [exchangeRates, cookieStore] = await Promise.all([
    getExchangeRates(),
    cookies(),
  ]);
  const activeMarket = getMarketByCountry(
    cookieStore.get(CURRENCY_COUNTRY_COOKIE)?.value,
  );

  // Keep the private cart promise lazy so CartAwareChrome can resolve it in its
  // own nested Suspense boundary without delaying the rest of the storefront.
  const cart = getCart().catch((error: unknown) => {
    const digest =
      typeof error === "object" && error !== null && "digest" in error
        ? (error as { digest?: string }).digest
        : undefined;
    if (digest !== "HANGING_PROMISE_REJECTION") {
      console.error("[cart] Unable to hydrate cart", error);
    }
    return undefined;
  });

  return (
    <CartProvider cartPromise={cart}>
      <CurrencyPreferenceProvider initialMarket={activeMarket}>
        <ExchangeRatesProvider rates={exchangeRates}>
          <WishlistProvider>
            <SiteShell
              leftNavItems={leftNavItems}
              rightNavItems={rightNavItems}
              logoSrc="/logo-lockup-white.png"
              locales={["EN", "IN"]}
            >
              {children}
            </SiteShell>
          </WishlistProvider>
        </ExchangeRatesProvider>
      </CurrencyPreferenceProvider>
    </CartProvider>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Open+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <StorefrontProviders>{children}</StorefrontProviders>
        </Suspense>
      </body>
    </html>
  );
}
