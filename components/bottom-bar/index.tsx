import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";

type Props = {
  count: number;
  discoverHref?: string;
  selectedProduct?: Product;
  relatedProducts?: Product[];
  isExpanded?: boolean;
  onClose?: () => void;
};

export function BottomBar({
  count,
  discoverHref = "/indexes/products",
  selectedProduct,
  relatedProducts,
  isExpanded = false,
  onClose,
}: Props) {
  if (selectedProduct) {
    const productsToShow = relatedProducts?.length
      ? relatedProducts
      : [selectedProduct];

    if (isExpanded) {
      return (
        <div className={styles.expandedPanel}>
          <div className={styles.expandedCards}>
            {productsToShow.map((p) => {
              const price = p.priceRange?.minVariantPrice;
              const priceString = price
                ? `${parseInt(price.amount, 10)} ${price.currencyCode}`
                : "";

              return (
                <div key={p.id} className={styles.productCard}>
                  <div className={styles.cardInfo}>
                    <span className={styles.cardTitle}>{p.title.toUpperCase()}</span>
                    <span className={styles.cardPrice}>{priceString}</span>
                  </div>
                  <Link href={`/products/${p.handle}`} className={styles.cardImageLink}>
                    {p.featuredImage && (
                      <Image
                        src={p.featuredImage.url}
                        alt={p.title}
                        fill
                        sizes="(max-width: 900px) 45vw, 15vw"
                        className={styles.cardImage}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className={styles.expandedFooter}>
            <span className={styles.count}>{productsToShow.length} PRODUCTS</span>
            <button className={styles.discover} onClick={onClose}>
              CLOSE
            </button>
          </div>
        </div>
      );
    }

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
