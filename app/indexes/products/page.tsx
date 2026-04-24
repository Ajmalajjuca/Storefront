import { Footer } from "components/footer";
import { PageInfo } from "components/page-info";
import { ProductCard } from "components/product-card";
import { getProducts } from "lib/shopify";
import styles from "./page.module.css";

export const metadata = {
  title: "All Products",
  description: "Browse the full collection.",
};

export default async function ProductsIndexPage() {
  const products = await getProducts({}).catch(() => []);

  return (
    <>
      <PageInfo title="All" count={products.length} />

      <div className={styles.wrapper}>
        <div className={styles.grid}>
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              priority={i < 8}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
