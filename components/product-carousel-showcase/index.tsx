"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useState,
} from "react";
import styles from "./index.module.css";

export type ProductCarouselShowcaseItem = {
  id: string;
  title: string;
  handle?: string;
  price?: string;
  image?: string;
  imageAlt?: string;
};

type Props = {
  products?: ProductCarouselShowcaseItem[];
  backgroundImage?: string;
};

const defaultBackgroundImage = "/bg-carousel.png";

export function ProductCarouselShowcase({
  products = [],
  backgroundImage = defaultBackgroundImage,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const productCount = products.length;

  useEffect(() => {
    if (activeIndex > productCount - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, productCount]);

  if (productCount === 0) return null;

  const rightIndex = productCount > 1 ? (activeIndex + 1) % productCount : null;
  const visibleProducts = [
    {
      product: products[activeIndex],
      productIndex: activeIndex,
      slotClassName: productCount > 1 ? styles.leftCard : styles.singleCard,
    },
    ...(rightIndex !== null
      ? [
          {
            product: products[rightIndex],
            productIndex: rightIndex,
            slotClassName: styles.rightCard,
          },
        ]
      : []),
  ].filter(
    (
      item,
    ): item is {
      product: ProductCarouselShowcaseItem;
      productIndex: number;
      slotClassName: string;
    } => Boolean(item.product),
  );

  const goToPrevious = () => {
    setActiveIndex((index) => (index === 0 ? productCount - 1 : index - 1));
  };

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % productCount);
  };

  const onArrowKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  };

  const frameStyle = {
    "--product-carousel-bg": `url("${backgroundImage}")`,
  } as CSSProperties;

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
            <p className={styles.eyebrow}>Latest drop</p>
            <h2 id="product-carousel-showcase-title" className={styles.title}>
              UNLEASH THE PSYCHO IN STYLE
            </h2>
            <p className={styles.subtitle}>Explore the latest BLCKOLE drops</p>
          </header>

          <div className={styles.carousel} aria-label="Product carousel">
            <button
              type="button"
              className={`${styles.arrowButton} ${styles.arrowPrevious}`}
              aria-label="Show previous product"
              onClick={goToPrevious}
              onKeyDown={onArrowKeyDown}
            >
              <span aria-hidden="true">&lsaquo;</span>
            </button>

            <div className={styles.viewport}>
              <div className={styles.track}>
                {visibleProducts.map(
                  ({ product, productIndex, slotClassName }) => {
                    const href = product.handle
                      ? `/products/${product.handle}`
                      : undefined;
                    const isActive = productIndex === activeIndex;
                    const cardClassName = `${styles.card} ${slotClassName}`;
                    const commonProps = {
                      className: cardClassName,
                      "aria-current": isActive ? ("true" as const) : undefined,
                    };

                    const cardContent = (
                      <>
                        <span className={styles.imageWrap}>
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.imageAlt ?? product.title}
                              fill
                              sizes="(max-width: 720px) 66vw, 340px"
                              className={styles.productImage}
                            />
                          ) : (
                            <span className={styles.imageFallback} />
                          )}
                        </span>
                        <span className={styles.cardInfo}>
                          <span className={styles.productTitle}>
                            {product.title}
                          </span>
                          {product.price ? (
                            <span className={styles.productPrice}>
                              {product.price}
                            </span>
                          ) : null}
                        </span>
                      </>
                    );

                    return href ? (
                      <Link
                        key={product.id}
                        href={href}
                        aria-label={`View ${product.title}`}
                        {...commonProps}
                      >
                        {cardContent}
                      </Link>
                    ) : (
                      <button
                        key={product.id}
                        type="button"
                        aria-label={product.title}
                        onClick={() => setActiveIndex(productIndex)}
                        {...commonProps}
                      >
                        {cardContent}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <button
              type="button"
              className={`${styles.arrowButton} ${styles.arrowNext}`}
              aria-label="Show next product"
              onClick={goToNext}
              onKeyDown={onArrowKeyDown}
            >
              <span aria-hidden="true">&rsaquo;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
