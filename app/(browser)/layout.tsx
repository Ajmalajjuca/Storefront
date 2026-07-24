import { HomeScene } from "components/home-scene";
import type { ProductCarouselShowcaseItem } from "components/product-carousel-showcase";
import {
  getBrandQuoteContent,
  getFooterContent,
  getHomeContent,
  getProducts,
  getServiceBarItems,
  getWhyChooseItems,
} from "lib/shopify";
import type { Product } from "lib/shopify/types";
import { Suspense, type ReactNode } from "react";

function mapProductsToCarouselItems(
  products: Product[],
): ProductCarouselShowcaseItem[] {
  return products
    .filter((product) => product.id && product.title)
    .map((product) => {
      const image = product.featuredImage || product.images[0];
      const price = product.priceRange?.minVariantPrice;

      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        // Raw price — the client cards convert/format to the shopper's selected
        // currency via useDisplayMoney() (reads ?currency= from the URL).
        priceAmount: price ? Number(price.amount) : undefined,
        priceCurrencyCode: price?.currencyCode,
        image: image?.url,
        imageAlt: image?.altText ?? product.title,
      };
    });
}

async function BrowserShell({ children }: { children: ReactNode }) {
  const [
    homeContent,
    products,
    serviceBarItems,
    whyChooseItems,
    brandQuoteContent,
    footerContent,
  ] = await Promise.all([
    getHomeContent().catch(() => undefined),
    getProducts({ reverse: true, sortKey: "CREATED_AT" }).catch(() => []),
    getServiceBarItems().catch(() => []),
    getWhyChooseItems().catch(() => []),
    getBrandQuoteContent().catch(() => undefined),
    getFooterContent().catch(() => undefined),
  ]);

  const carouselProducts = mapProductsToCarouselItems(products);

  return (
    <>
      <HomeScene
        content={homeContent}
        carouselProducts={carouselProducts}
        serviceBarItems={serviceBarItems}
        whyChooseItems={whyChooseItems}
        brandQuoteContent={brandQuoteContent}
        footerContent={footerContent}
      />
      {children}
    </>
  );
}

export default function BrowserLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <BrowserShell>{children}</BrowserShell>
    </Suspense>
  );
}
