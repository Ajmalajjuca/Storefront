"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
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
  visibleProductCount?: 5 | 7;
};

const defaultBackgroundImage = "/bg-carousel1.png";
const activeCardScale = 1.12;

function getWrappedIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

function getSlotClassName(offset: number) {
  const distance = Math.abs(offset);

  if (distance === 0) return styles.active;
  if (distance === 1) return styles.near;
  if (distance === 2) return styles.middle;

  return styles.far;
}

export function ProductCarouselShowcase({
  products = [],
  backgroundImage = defaultBackgroundImage,
  visibleProductCount = 7,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageStyle, setStageStyle] = useState<CSSProperties>({});
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>(
    [],
  );
  const productCount = products.length;

  useEffect(() => {
    if (activeIndex > productCount - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, productCount]);

  const sideCount = visibleProductCount === 5 ? 2 : 3;
  const effectiveSideCount = Math.min(
    sideCount,
    Math.max(0, Math.floor((productCount - 1) / 2)),
  );
  const slotStep = effectiveSideCount > 0 ? 38 / effectiveSideCount : 0;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const updateViewportMode = () => setIsMobileViewport(mediaQuery.matches);

    updateViewportMode();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateViewportMode);
      return () => mediaQuery.removeEventListener("change", updateViewportMode);
    }

    window.addEventListener("resize", updateViewportMode);
    return () => window.removeEventListener("resize", updateViewportMode);
  }, []);

  useEffect(() => {
    if (!isMobileViewport) return;

    cardRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex, isMobileViewport]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateStageSize = () => {
      const { width, height } = viewport.getBoundingClientRect();
      const isMobile = window.matchMedia("(max-width: 900px)").matches;

      if (isMobile || width <= 0 || height <= 0) {
        setStageStyle({});
        return;
      }

      const safeHeight = Math.max(360, height - 30);
      const cardHeight = Math.min(
        560,
        Math.max(420, safeHeight / activeCardScale),
      );
      const availableWidth = Math.max(420, width - 120);
      const widthBySlots = availableWidth / (visibleProductCount + 0.35);
      const cardWidth = Math.min(
        320,
        Math.max(220, Math.min(widthBySlots, cardHeight * 0.68)),
      );

      const nextStageStyle = {
        "--card-width": `${Math.round(cardWidth)}px`,
        "--card-height": `${Math.round(cardHeight)}px`,
        "--active-card-scale": String(activeCardScale),
      } as CSSProperties;

      setStageStyle((currentStageStyle) => {
        if (
          currentStageStyle["--card-width" as keyof CSSProperties] ===
            nextStageStyle["--card-width" as keyof CSSProperties] &&
          currentStageStyle["--card-height" as keyof CSSProperties] ===
            nextStageStyle["--card-height" as keyof CSSProperties] &&
          currentStageStyle["--active-card-scale" as keyof CSSProperties] ===
            nextStageStyle["--active-card-scale" as keyof CSSProperties]
        ) {
          return currentStageStyle;
        }

        return nextStageStyle;
      });
    };

    updateStageSize();

    const resizeObserver = new ResizeObserver(updateStageSize);
    resizeObserver.observe(viewport);
    window.addEventListener("resize", updateStageSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateStageSize);
    };
  }, [visibleProductCount]);

  const frameStyle = useMemo(
    () =>
      ({
        "--product-carousel-bg": `url("${backgroundImage}")`,
        ...stageStyle,
      }) as CSSProperties,
    [backgroundImage, stageStyle],
  );

  if (productCount === 0) return null;

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

            <div className={styles.viewport} ref={viewportRef}>
              <div className={styles.track}>
                {products.map((product, productIndex) => {
                  const offset = getWrappedIndex(
                    productIndex - activeIndex,
                    productCount,
                  );
                  const circularOffset =
                    offset > productCount / 2 ? offset - productCount : offset;
                  const isVisible =
                    isMobileViewport ||
                    Math.abs(circularOffset) <= effectiveSideCount;
                  const clampedOffset = Math.max(
                    -(effectiveSideCount + 1),
                    Math.min(effectiveSideCount + 1, circularOffset),
                  );
                  const slotLeft = 50 + clampedOffset * slotStep;
                  const href = product.handle
                    ? `/products/${product.handle}`
                    : undefined;
                  const isActive = productIndex === activeIndex;
                  const cardClassName = `${styles.card} ${
                    isVisible ? getSlotClassName(circularOffset) : styles.hidden
                  }`;
                  const commonProps = {
                    className: cardClassName,
                    style: { "--slot-left": `${slotLeft}%` } as CSSProperties,
                    "aria-current": isActive ? ("true" as const) : undefined,
                    "aria-hidden": isVisible ? undefined : true,
                    tabIndex: isVisible ? undefined : -1,
                    ref: (
                      node: HTMLAnchorElement | HTMLButtonElement | null,
                    ) => {
                      cardRefs.current[productIndex] = node;
                    },
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
                })}
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
