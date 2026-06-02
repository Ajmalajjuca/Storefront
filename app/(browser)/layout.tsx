import type { CollectionShowcaseItem } from "components/collection-showcase";
import { HomeScene } from "components/home-scene";
import {
  getBrandQuoteContent,
  getBrandStatementContent,
  getBrandValueItems,
  getCollections,
  getFooterContent,
  getHomeContent,
  getServiceBarItems,
  getWhyChooseItems,
} from "lib/shopify";
import type { Collection } from "lib/shopify/types";
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
  console.log("Mapping collections to showcase items", { collections });
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

async function BrowserShell({ children }: { children: ReactNode }) {
  const [
    homeContent,
    collections,
    serviceBarItems,
    whyChooseItems,
    brandQuoteContent,
    brandStatementContent,
    brandValueItems,
    footerContent,
  ] = await Promise.all([
    getHomeContent().catch(() => undefined),
    getCollections().catch(() => []),
    getServiceBarItems().catch(() => []),
    getWhyChooseItems().catch(() => []),
    getBrandQuoteContent().catch(() => undefined),
    getBrandStatementContent().catch(() => undefined),
    getBrandValueItems().catch(() => []),
    getFooterContent().catch(() => undefined),
  ]);

  const heroImageUrl = homeContent?.heroImage?.url;
  const showcaseCollections = mapCollectionsToShowcaseItems(collections);

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
