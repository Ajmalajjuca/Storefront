import { HomeScene } from "components/home-scene";
import { getSelectedCountryCode } from "lib/currency-server";
import {
  getBrandQuoteContent,
  getBrandValueItems,
  getCollectionProducts,
  getFooterContent,
  getHomeContent,
  getProductRecommendations,
  getProducts,
  getServiceBarItems,
  getWhyChooseItems,
} from "lib/shopify";
import type { Product } from "lib/shopify/types";
import { Suspense, type ReactNode } from "react";

async function BrowserShell({ children }: { children: ReactNode }) {
  const countryCode = await getSelectedCountryCode();

  const [
    featuredCollection,
    featuredProducts,
    homeContent,
    serviceBarItems,
    whyChooseItems,
    brandQuoteContent,
    brandValueItems,
    footerContent,
  ] = await Promise.all([
    getCollectionProducts({
      collection: "hidden-homepage-featured-items",
      countryCode,
    }).catch(() => []),
    getProducts({ countryCode }).catch(() => []),
    getHomeContent().catch(() => undefined),
    getServiceBarItems().catch(() => []),
    getWhyChooseItems().catch(() => []),
    getBrandQuoteContent().catch(() => undefined),
    getBrandValueItems().catch(() => []),
    getFooterContent().catch(() => undefined),
  ]);

  const products =
    featuredCollection.length > 0 ? featuredCollection : featuredProducts;

  const recommendationsMap: Record<string, Product[]> = {};
  const recommendationResults = await Promise.all(
    products.map((p) =>
      getProductRecommendations(p.id, "RELATED", countryCode).catch(() => []),
    ),
  );
  products.forEach((p, i) => {
    recommendationsMap[p.id] = recommendationResults[i] ?? [];
  });

  const heroImageUrl = homeContent?.heroImage?.url;

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
        products={products}
        recommendationsMap={recommendationsMap}
        featuredProducts={featuredProducts}
        content={homeContent}
        serviceBarItems={serviceBarItems}
        whyChooseItems={whyChooseItems}
        brandQuoteContent={brandQuoteContent}
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
