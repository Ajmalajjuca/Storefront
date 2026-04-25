import type { Product } from "lib/shopify/types";
import Link from "next/link";
import styles from "./index.module.css";

type Props = {
  count: number;
  discoverHref?: string;
  selectedProduct?: Product;
  relatedProducts?: Product[];
};

export function BottomBar({
  count,
  discoverHref = "/indexes/products",
  selectedProduct,
  relatedProducts,
}: Props) {
  if (selectedProduct) {
    const productsToShow = relatedProducts?.length
      ? relatedProducts
      : [selectedProduct];

    return (
      <div className={styles.group}>
        {productsToShow.map((p) => (
          <div key={p.id} className={styles.wrapper}>
            <span className={styles.count}>{p.title.toUpperCase()}</span>
            <Link href={`/products/${p.handle}`} className={styles.discover}>
              VIEW
            </Link>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.group}>
      <div className={styles.wrapper}>
        <span className={styles.count}>{count} PRODUCTS</span>
        <Link href={discoverHref} className={styles.discover}>
          DISCOVER
        </Link>
      </div>
    </div>
  );
}
