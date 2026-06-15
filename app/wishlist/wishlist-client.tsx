"use client";

import { ProductCard } from "components/product-card";
import {
  useWishlist,
  type WishlistItem,
} from "components/wishlist/wishlist-context";
import type { Product } from "lib/shopify/types";
import Link from "next/link";
import styles from "./page.module.css";

// Rebuild the minimal shape ProductCard reads, so saved items render with the
// exact same card as the shop grid (image, title, price, and the heart that
// removes them).
function toProduct(item: WishlistItem): Product {
  const image = item.image
    ? {
        url: item.image,
        altText: item.imageAlt ?? item.title,
        width: 0,
        height: 0,
      }
    : undefined;
  const money = {
    amount: String(item.priceAmount ?? 0),
    currencyCode: item.priceCurrencyCode ?? "INR",
  };

  return {
    handle: item.handle,
    title: item.title,
    featuredImage: image,
    images: image ? [image] : [],
    priceRange: { minVariantPrice: money, maxVariantPrice: money },
  } as unknown as Product;
}

export function WishlistClient() {
  const { items, count, ready, clear } = useWishlist();

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Saved</p>
        <h1 className={styles.headline}>Wishlist</h1>
        <p className={styles.dek}>
          The pieces you&apos;ve kept an eye on — tap the heart to remove.
        </p>
      </header>

      {/* Neutral until hydration so SSR and client agree. */}
      {!ready ? null : count === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            You haven&apos;t saved anything yet. Tap the heart on a piece to
            keep it here.
          </p>
          <Link href="/indexes/products" className={styles.shopLink}>
            Browse the line
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.toolbar}>
            <span className={styles.count}>
              {count} {count === 1 ? "piece" : "pieces"}
            </span>
            <button type="button" className={styles.clear} onClick={clear}>
              Clear all
            </button>
          </div>

          <div className={styles.grid}>
            {items.map((item, index) => (
              <ProductCard
                key={item.handle}
                product={toProduct(item)}
                index={index}
                priority={index < 8}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
