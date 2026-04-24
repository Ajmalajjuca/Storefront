import { CartProvider } from "components/cart/cart-context";
import { SiteShell } from "components/site-shell";
import { getCart, getPages, getProducts } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { ReactNode } from "react";
import "./globals.css";

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME ?? "Storefront",
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cart = getCart();

  const [products, pages] = await Promise.all([
    getProducts({}).catch(() => []),
    getPages().catch(() => []),
  ]);

  const storyCount = pages.filter((p) => p.handle.startsWith("story-")).length;

  const navItems = [
    { title: "All", href: "/indexes/products", count: products.length },
    ...(storyCount > 0
      ? [{ title: "Stories", href: "/story", count: storyCount }]
      : []),
  ];

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
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;700&family=Barlow:ital,wght@0,400;0,500;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider cartPromise={cart}>
          <SiteShell navItems={navItems}>{children}</SiteShell>
        </CartProvider>
      </body>
    </html>
  );
}
