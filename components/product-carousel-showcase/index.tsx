"use client";

import { useDisplayMoney } from "components/currency/use-display-money";
import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
const AUTO_SCROLL_SPEED = 72;

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className={styles.arrowIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProductCarouselShowcase({
  products = [],
  backgroundImage = defaultBackgroundImage,
}: Props) {
  const formatPrice = useDisplayMoney();
  const railRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const autoResumeAtRef = useRef(0);
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    scrollLeft: 0,
  });

  const frameStyle = useMemo(
    () =>
      ({
        "--product-carousel-bg": `url("${backgroundImage}")`,
      }) as CSSProperties,
    [backgroundImage],
  );

  useEffect(() => {
    const rail = railRef.current;
    const firstGroup = firstGroupRef.current;
    if (!rail || !firstGroup || products.length < 2) return;
    const carouselRail = rail;
    const carouselGroup = firstGroup;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let previousTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = Math.min(currentTime - previousTime, 50);
      previousTime = currentTime;

      if (
        !reducedMotion.matches &&
        !dragRef.current.active &&
        currentTime >= autoResumeAtRef.current &&
        !carouselRail.matches(":focus-within")
      ) {
        // Increasing scrollLeft moves the products visually from right to left.
        carouselRail.scrollLeft += (AUTO_SCROLL_SPEED * elapsed) / 1000;

        const track = carouselGroup.parentElement;
        const gap = track
          ? Number.parseFloat(getComputedStyle(track).columnGap) || 0
          : 0;
        const loopPoint = carouselGroup.offsetWidth + gap;

        if (loopPoint > 0 && carouselRail.scrollLeft >= loopPoint) {
          carouselRail.scrollLeft -= loopPoint;
        }
      }

      animationFrame = requestAnimationFrame(animate);
    }

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [products.length]);

  function pauseAutoScroll(duration = 2500) {
    autoResumeAtRef.current = performance.now() + duration;
  }

  function scrollRail(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;

    const card = rail.querySelector<HTMLElement>(`.${styles.card}`);
    const step = card
      ? card.offsetWidth + 24
      : Math.round(rail.clientWidth * 0.7);

    pauseAutoScroll();
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  function startDragging(event: PointerEvent<HTMLDivElement>) {
    pauseAutoScroll();
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    const rail = railRef.current;
    if (!rail) return;

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
    };
    rail.dataset.dragging = "true";
    rail.setPointerCapture(event.pointerId);
  }

  function dragProducts(event: PointerEvent<HTMLDivElement>) {
    pauseAutoScroll();
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 5) drag.moved = true;
    if (!drag.moved) return;

    event.preventDefault();
    rail.scrollLeft = drag.scrollLeft - distance;
  }

  function stopDragging(event: PointerEvent<HTMLDivElement>) {
    pauseAutoScroll();
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active || drag.pointerId !== event.pointerId) return;

    drag.active = false;
    delete rail.dataset.dragging;

    if (rail.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }
  }

  function preventDraggedClick(event: MouseEvent<HTMLDivElement>) {
    if (!dragRef.current.moved) return;

    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  }

  if (products.length === 0) return null;

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
            <h2 id="product-carousel-showcase-title" className={styles.title}>
              Upcoming Collection
            </h2>

            <div className={styles.arrows}>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => scrollRail(-1)}
                aria-label="Scroll upcoming products to previous"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => scrollRail(1)}
                aria-label="Scroll upcoming products to next"
              >
                <ArrowIcon direction="right" />
              </button>
            </div>
          </header>

          <div className={styles.carousel} aria-label="Upcoming drop carousel">
            <div
              className={styles.rail}
              ref={railRef}
              aria-label="Upcoming products"
              onPointerDown={startDragging}
              onPointerMove={dragProducts}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              onClickCapture={preventDraggedClick}
              onDragStart={(event) => event.preventDefault()}
              onWheel={() => pauseAutoScroll()}
            >
              <div className={styles.track}>
                {[false, true].map((isClone) => (
                  <div
                    key={isClone ? "clone" : "original"}
                    ref={isClone ? undefined : firstGroupRef}
                    className={styles.group}
                    aria-hidden={isClone ? "true" : undefined}
                  >
                    {products.map((product) => {
                      const href = `/prebook/${product.handle ?? "next-drop"}`;

                      return (
                        <article key={product.id} className={styles.card}>
                          <Link
                            href={href}
                            className={styles.cardLink}
                            aria-label={`Prebook ${product.title}`}
                            tabIndex={isClone ? -1 : undefined}
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
