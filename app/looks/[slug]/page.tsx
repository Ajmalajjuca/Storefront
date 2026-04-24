import { Footer } from "components/footer";
import { ProductCard } from "components/product-card";
import { getCollectionProducts, getPage } from "lib/shopify";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(`looks-${params.slug}`).catch(() => null);
  if (!page) return { title: params.slug };

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description,
    openGraph: { type: "article" },
  };
}

export default async function LooksPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  // Try to get products from a collection matching the slug
  const products = await getCollectionProducts({
    collection: params.slug,
  }).catch(() => []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{params.slug.replace(/-/g, " ")}</h1>
      </div>

      {products.length > 0 && (
        <div className={styles.grid}>
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
