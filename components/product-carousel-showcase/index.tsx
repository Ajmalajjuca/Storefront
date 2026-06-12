"use client";

import { useDisplayMoney } from "components/currency/use-display-money";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useMemo, useRef } from "react";
import styles from "./index.module.css";

export type ProductCarouselShowcaseItem = {
  id: string;
  title: string;
  handle?: string;
  priceAmount?: number;
  priceCurrencyCode?: string;
  image?: string;
  imageAlt?: string;
};

type Props = {
  products?: ProductCarouselShowcaseItem[];
  backgroundImage?: string;
  /** Kept for compatibility; the rail now sizes tiles equally. */
  visibleProductCount?: 5 | 7;
};

const defaultBackgroundImage = "/bg-carousel1.png";

export function ProductCarouselShowcase({
  products = [],
  backgroundImage = defaultBackgroundImage,
}: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const formatPrice = useDisplayMoney();

  const frameStyle = useMemo(
    () =>
      ({
        "--product-carousel-bg": `url("${backgroundImage}")`,
      }) as CSSProperties,
    [backgroundImage],
  );

  if (products.length === 0) return null;

  function scrollRail(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(`.${styles.card}`);
    const step = card
      ? card.offsetWidth + 24
      : Math.round(rail.clientWidth * 0.7);
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section
      className={styles.section}
      aria-labelledby="product-carousel-showcase-title"
    >
      <div className={styles.frame} style={frameStyle}>
        <div className={styles.background} aria-hidden="true" />
        <div className={styles.overlay} aria-hidden="true" />

        <div className={styles.content}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Upcoming Collection</p>
            <h2 id="product-carousel-showcase-title" className={styles.title}>
              The next drop is coming
            </h2>
          </header>

          <div className={styles.carousel} aria-label="Upcoming drop carousel">
            <button
              type="button"
              className={`${styles.arrowButton} ${styles.arrowPrevious}`}
              aria-label="Scroll to previous"
              onClick={() => scrollRail(-1)}
            >
              <span aria-hidden="true">&lsaquo;</span>
            </button>

            <div className={styles.rail} ref={railRef}>
              {products.map((product) => {
                const href = `/prebook/${product.handle ?? "next-drop"}`;

                return (
                  <article key={product.id} className={styles.card}>
                    <Link
                      href={href}
                      className={styles.cardLink}
                      aria-label={`Prebook ${product.title}`}
                    >
                      <span className={styles.imageWrap}>
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.imageAlt ?? product.title}
                            fill
                            sizes="(max-width: 900px) 64vw, 320px"
                            className={styles.productImage}
                          />
                        ) : (
                          <span className={styles.imageFallback} />
                        )}
                      </span>

                      <span className={styles.badge}>Next drop</span>

                      <span className={styles.cardInfo}>
                        <span className={styles.productTitle}>
                          {product.title}
                        </span>
                        {product.priceAmount != null &&
                        product.priceCurrencyCode ? (
                          <span className={styles.productPrice}>
                            {formatPrice(
                              product.priceAmount,
                              product.priceCurrencyCode,
                            )}
                          </span>
                        ) : null}
                        <span className={styles.notify}>
                          Notify me
                          <svg
                            className={styles.notifyIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            aria-hidden
                          >
                            <path
                              d="M5 12h14M13 6l6 6-6 6"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              className={`${styles.arrowButton} ${styles.arrowNext}`}
              aria-label="Scroll to next"
              onClick={() => scrollRail(1)}
            >
              <span aria-hidden="true">&rsaquo;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
