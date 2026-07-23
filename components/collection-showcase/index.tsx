"use client";

import { useDisplayMoney } from "components/currency/use-display-money";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import styles from "./index.module.css";

export type LatestProductItem = {
  id: string;
  title: string;
  handle?: string;
  priceAmount?: number;
  priceCurrencyCode?: string;
  image?: string;
  imageAlt?: string;
};

type Props = {
  products?: LatestProductItem[];
};

const fallbackProducts: LatestProductItem[] = [
  {
    id: "green-dragonfly-top",
    title: "Green Dragonfly Top",
    handle: "green-dragonfly-top",
    priceAmount: 4200,
    priceCurrencyCode: "INR",
    image: "/topwearr.png",
  },
  {
    id: "orng-dragonfly-top",
    title: "Orng Dragonfly Top",
    handle: "orng-dragonfly-top",
    priceAmount: 4200,
    priceCurrencyCode: "INR",
    image: "/bottomwear.png",
  },
  {
    id: "iron-ladybird-top",
    title: "Iron Ladybird Top",
    handle: "iron-ladybird-top",
    priceAmount: 4300,
    priceCurrencyCode: "INR",
    image: "/void-entry-bg.png",
  },
  {
    id: "brunette-crystal-tank",
    title: "Brunette Crystal Tank Top",
    handle: "brunette-crystal-tank",
    priceAmount: 5100,
    priceCurrencyCode: "INR",
    image: "/Story_2.png",
  },
  {
    id: "blckole-system-tee",
    title: "BLCKOLE System Tee",
    handle: "blckole-system-tee",
    priceAmount: 4800,
    priceCurrencyCode: "INR",
    image: "/blckole-1.png",
  },
];

function PlusIcon() {
  return (
    <svg
      className={styles.plusIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className={styles.arrowIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden
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

export function CollectionShowcase({ products }: Props) {
  const items = products && products.length > 0 ? products : fallbackProducts;
  const railRef = useRef<HTMLDivElement>(null);
  const formatPrice = useDisplayMoney();

  function scrollRail(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(`.${styles.card}`);
    const step = card
      ? card.offsetWidth + 24
      : Math.round(rail.clientWidth * 0.7);
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <section
      className={styles.section}
      aria-labelledby="latest-collection-title"
    >
      <div className={styles.header}>
        <h2 id="latest-collection-title" className={styles.title}>
          Latest Collection
        </h2>

        <div className={styles.headerActions}>
          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollRail(-1)}
              aria-label="Scroll to previous"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollRail(1)}
              aria-label="Scroll to next"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>

          <Link href="/indexes/products" className={styles.discover}>
            Discover more
          </Link>
        </div>
      </div>

      <div className={styles.rail} ref={railRef}>
        {items.map((item) => {
          const href = item.handle
            ? `/products/${item.handle}`
            : "/indexes/products";

          return (
            <article key={item.id} className={styles.card}>
              <Link
                href={href}
                className={styles.cardLink}
                aria-label={item.title}
              >
                <span className={styles.cardMedia}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.imageAlt ?? item.title}
                      fill
                      sizes="(max-width: 900px) 72vw, 23vw"
                      className={styles.cardImage}
                    />
                  ) : null}
                </span>

                <span className={styles.scrim} aria-hidden="true" />
                <span className={styles.glassPanel} aria-hidden="true">
                  <span className={styles.glassEdge} />
                </span>

                <span className={styles.cardInfo}>
                  <span className={styles.cardText}>
                    <span className={styles.cardName}>{item.title}</span>
                    <span className={styles.cardPrice}>
                      {item.priceAmount != null && item.priceCurrencyCode
                        ? formatPrice(item.priceAmount, item.priceCurrencyCode)
                        : "View piece"}
                    </span>
                  </span>
                  <span className={styles.plus}>
                    <PlusIcon />
                  </span>
                </span>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
