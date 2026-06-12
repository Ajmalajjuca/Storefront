import { HomeScene } from "components/home-scene";
import type { ProductCarouselShowcaseItem } from "components/product-carousel-showcase";
import {
  getBrandQuoteContent,
  getBrandStatementContent,
  getBrandValueItems,
  getFooterContent,
  getHomeContent,
  getProducts,
  getServiceBarItems,
  getWhyChooseItems,
} from "lib/shopify";
import { formatMoney } from "lib/money";
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
        price: price
          ? formatMoney({
              amount: price.amount,
              currencyCode: price.currencyCode,
            })
          : undefined,
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
    brandStatementContent,
    brandValueItems,
    footerContent,
  ] = await Promise.all([
    getHomeContent().catch(() => undefined),
    getProducts({ reverse: true, sortKey: "CREATED_AT" }).catch(() => []),
    getServiceBarItems().catch(() => []),
    getWhyChooseItems().catch(() => []),
    getBrandQuoteContent().catch(() => undefined),
    getBrandStatementContent().catch(() => undefined),
    getBrandValueItems().catch(() => []),
    getFooterContent().catch(() => undefined),
  ]);

  const heroImageUrl = homeContent?.heroImage?.url;
  const carouselProducts = mapProductsToCarouselItems(products);

  return (
    <>
      {heroImageUrl && (
        <link
          rel="preload"
          as="image"
          href={heroImageUrl}
          fetchPriority="high"
        />
      )}
      <HomeScene
        content={homeContent}
        carouselProducts={carouselProducts}
        serviceBarItems={serviceBarItems}
        whyChooseItems={whyChooseItems}
        brandQuoteContent={brandQuoteContent}
        brandStatementContent={brandStatementContent}
        brandValueItems={brandValueItems}
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
