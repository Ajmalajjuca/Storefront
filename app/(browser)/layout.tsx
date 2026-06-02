import type { CollectionShowcaseItem } from "components/collection-showcase";
import { HomeScene } from "components/home-scene";
import type { ProductCarouselShowcaseItem } from "components/product-carousel-showcase";
import {
  getBrandQuoteContent,
  getBrandStatementContent,
  getBrandValueItems,
  getCollections,
  getFooterContent,
  getHomeContent,
  getProducts,
  getServiceBarItems,
  getWhyChooseItems,
} from "lib/shopify";
import { formatMoney } from "lib/money";
import type { Collection, Product } from "lib/shopify/types";
import { Suspense, type ReactNode } from "react";

const fallbackShowcaseImages: [string, ...string[]] = [
  "/topwearr.png",
  "/bottomwear.png",
  "/void-entry-bg.png",
  "/Story_2.png",
  "/blckole-1.png",
];

function mapCollectionsToShowcaseItems(
  collections: Collection[],
): CollectionShowcaseItem[] {
  return collections
    .filter((collection) => collection.handle)
    .slice(0, 6)
    .map((collection, index) => {
      const fallbackImage =
        fallbackShowcaseImages[index % fallbackShowcaseImages.length] ??
        fallbackShowcaseImages[0];
      const imageUrl = collection.image?.url || fallbackImage;

      return {
        id: collection.handle,
        title: collection.title,
        subtitle:
          collection.description ||
          collection.seo?.description ||
          "BLCKOLE edit",
        label: index === 0 ? "Collection" : "Collection",
        handle: collection.handle,
        cardImage: imageUrl,
        backgroundImage: imageUrl,
      };
    });
}

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
    collections,
    products,
    serviceBarItems,
    whyChooseItems,
    brandQuoteContent,
    brandStatementContent,
    brandValueItems,
    footerContent,
  ] = await Promise.all([
    getHomeContent().catch(() => undefined),
    getCollections().catch(() => []),
    getProducts({ reverse: true, sortKey: "CREATED_AT" }).catch(() => []),
    getServiceBarItems().catch(() => []),
    getWhyChooseItems().catch(() => []),
    getBrandQuoteContent().catch(() => undefined),
    getBrandStatementContent().catch(() => undefined),
    getBrandValueItems().catch(() => []),
    getFooterContent().catch(() => undefined),
  ]);

  const heroImageUrl = homeContent?.heroImage?.url;
  const showcaseCollections = mapCollectionsToShowcaseItems(collections);
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
        showcaseCollections={showcaseCollections}
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
