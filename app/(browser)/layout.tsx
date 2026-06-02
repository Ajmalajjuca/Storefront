import { HomeScene } from "components/home-scene";
import {
  getBrandQuoteContent,
  getBrandStatementContent,
  getBrandValueItems,
  getFooterContent,
  getHomeContent,
  getServiceBarItems,
  getWhyChooseItems,
} from "lib/shopify";
import { Suspense, type ReactNode } from "react";

async function BrowserShell({ children }: { children: ReactNode }) {
  const [
    homeContent,
    serviceBarItems,
    whyChooseItems,
    brandQuoteContent,
    brandStatementContent,
    brandValueItems,
    footerContent,
  ] = await Promise.all([
    getHomeContent().catch(() => undefined),
    getServiceBarItems().catch(() => []),
    getWhyChooseItems().catch(() => []),
    getBrandQuoteContent().catch(() => undefined),
    getBrandStatementContent().catch(() => undefined),
    getBrandValueItems().catch(() => []),
    getFooterContent().catch(() => undefined),
  ]);

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
        content={homeContent}
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
