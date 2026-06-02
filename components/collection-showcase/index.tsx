"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./index.module.css";

export type CollectionShowcaseItem = {
  id: string;
  title: string;
  subtitle?: string;
  label?: string;
  handle: string;
  cardImage: string;
  backgroundImage: string;
};

type Props = {
  collections?: CollectionShowcaseItem[];
};

const fallbackCollections: CollectionShowcaseItem[] = [
  {
    id: "oversized-tshirts",
    title: "Oversized T-Shirts",
    subtitle: "Graphic topwear",
    label: "Core drop",
    handle: "oversized-tshirts",
    cardImage: "/topwearr.png",
    backgroundImage: "/topwearr.png",
  },
  {
    id: "bottomwear",
    title: "Bottom Wear",
    subtitle: "Wide volume",
    label: "Utility fit",
    handle: "bottomwear",
    cardImage: "/bottomwear.png",
    backgroundImage: "/bottomwear.png",
  },
  {
    id: "void-entry",
    title: "Void Entry",
    subtitle: "Dark campaign",
    label: "Editorial",
    handle: "void-entry",
    cardImage: "/void-entry-bg.png",
    backgroundImage: "/void-entry-bg.png",
  },
  {
    id: "road-story",
    title: "Road Story",
    subtitle: "Travel layers",
    label: "Story edit",
    handle: "road-story",
    cardImage: "/Story_2.png",
    backgroundImage: "/Story_2.png",
  },
  {
    id: "blckole-system",
    title: "BLCKOLE System",
    subtitle: "Monochrome essentials",
    label: "Limited",
    handle: "blckole-system",
    cardImage: "/blckole-1.png",
    backgroundImage: "/blckole-1.png",
  },
];

export function CollectionShowcase({ collections }: Props) {
  console.log("CollectionShowcase render", { collections });
  const displayCollections =
    collections && collections.length > 0 ? collections : fallbackCollections;

  const [activeId, setActiveId] = useState(displayCollections[0]?.id ?? "");

  const activeCollection = useMemo(
    () =>
      displayCollections.find((collection) => collection.id === activeId) ??
      displayCollections[0],
    [activeId, displayCollections],
  );

  if (!activeCollection) return null;

  return (
    <section
      className={styles.section}
      aria-labelledby="collection-showcase-title"
    >
      <div className={styles.frame}>
        <div className={styles.backgroundStack} aria-hidden="true">
          {displayCollections.map((collection, index) => (
            <Image
              key={collection.id}
              src={collection.backgroundImage}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className={`${styles.backgroundImage} ${
                collection.id === activeCollection.id
                  ? styles.backgroundImageActive
                  : ""
              }`}
            />
          ))}
        </div>
        <div className={styles.overlay} aria-hidden="true" />

        <div className={styles.content}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              {activeCollection.label ?? "Selected collection"}
            </p>
            <h2 id="collection-showcase-title" className={styles.title}>
              {activeCollection.title}
            </h2>
            <p className={styles.subtitle}>
              {activeCollection.subtitle ??
                "Explore BLCKOLE pieces through a cinematic product edit."}
            </p>
          </div>

          <Link
            href="/indexes/products"
            className={styles.exploreLink}
            aria-label={`Explore ${activeCollection.title}`}
          >
            <span>Explore</span>
          </Link>

          <div className={styles.cardRail} aria-label="Collection selector">
            {displayCollections.map((collection) => {
              const isActive = collection.id === activeCollection.id;

              return (
                <button
                  key={collection.id}
                  type="button"
                  className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveId(collection.id)}
                >
                  <span className={styles.cardMedia}>
                    <Image
                      src={collection.cardImage}
                      alt=""
                      fill
                      sizes="190px"
                      className={styles.cardImage}
                    />
                  </span>
                  <span className={styles.cardText}>
                    <span className={styles.cardLabel}>
                      {collection.label ?? "Collection"}
                    </span>
                    <span className={styles.cardTitle}>{collection.title}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
