import { Footer } from "components/footer";
import { PageInfo } from "components/page-info";
import { ProductCard } from "components/product-card";
import { TransversalBar } from "components/transversal-bar";
import { getCollectionProducts } from "lib/shopify";

export const metadata = {
  description:
    "Born on the road, made for the city. Technical, protective and unapologetically feminine.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  const [featured, carousel] = await Promise.all([
    getCollectionProducts({
      collection: "hidden-homepage-featured-items",
    }).catch(() => []),
    getCollectionProducts({
      collection: "hidden-homepage-carousel",
    }).catch(() => []),
  ]);

  // Use featured items for the transversal bar; fall back to carousel items
  const barItems = (featured.length > 0 ? featured : carousel)
    .filter((p) => p.featuredImage)
    .map((p) => ({
      id: p.id,
      title: p.title,
      imageUrl: p.featuredImage!.url,
      imageAlt: p.featuredImage!.altText ?? p.title,
      href: `/products/${p.handle}`,
    }));

  const allProducts = featured.length > 0 ? featured : carousel;

  return (
    <>
      <PageInfo title="Collection" count={allProducts.length} />

      {barItems.length > 0 ? (
        <TransversalBar items={barItems} />
      ) : (
        <div
          style={{
            minHeight: "calc(100dvh - var(--header-height))",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(220rem, 1fr))",
            gap: "var(--grid-gutter)",
            padding:
              "calc(var(--header-height) + var(--grid-margin)) var(--grid-margin) var(--grid-margin)",
          }}
        >
          {allProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              priority={i < 4}
            />
          ))}
        </div>
      )}

      <Footer />
    </>
  );
}
