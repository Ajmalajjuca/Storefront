"use client";

import {
  CollectionShowcase,
  type CollectionShowcaseItem,
} from "components/collection-showcase";
import { Footer } from "components/footer";
import { Manifesto } from "components/manifesto";
import { Newsletter } from "components/newsletter";
import { PressQuote } from "components/press-quote";
import { Principles } from "components/principles";
import {
  ProductCarouselShowcase,
  type ProductCarouselShowcaseItem,
} from "components/product-carousel-showcase";
import { ScrollStage } from "components/scroll-stage";
import { TrustBar } from "components/trust-bar";
import type {
  BrandQuoteContent,
  BrandStatementContent,
  BrandValueItem,
  FooterContent,
  HomeContent,
  ServiceBarItem,
  WhyChooseItem,
} from "lib/shopify/types";
import styles from "./index.module.css";

type Props = {
  content?: HomeContent;
  showcaseCollections?: CollectionShowcaseItem[];
  carouselProducts?: ProductCarouselShowcaseItem[];
  serviceBarItems?: ServiceBarItem[];
  whyChooseItems?: WhyChooseItem[];
  brandQuoteContent?: BrandQuoteContent;
  brandStatementContent?: BrandStatementContent;
  brandValueItems?: BrandValueItem[];
  footerContent?: FooterContent;
};

const brandValues: WhyChooseItem[] = [
  {
    title: "Premium Fabrics",
    description:
      "Built from elevated hand-feel materials chosen for comfort, structure, and daily wear.",
    subtitle: "Selected textures",
    sortOrder: 1,
  },
  {
    title: "Distinctive Designs",
    description:
      "Sharp silhouettes, graphic details, and statement pieces made to stand apart.",
    subtitle: "Blckole identity",
    sortOrder: 2,
  },
  {
    title: "Limited Drops",
    description:
      "Small-batch releases keep every drop focused, intentional, and harder to find twice.",
    subtitle: "Limited quantities",
    sortOrder: 3,
  },
  {
    title: "Considered Styling",
    description:
      "Build a full look from focused drops and move from browse to bag with confidence.",
    subtitle: "Intentional pairings",
    sortOrder: 4,
  },
];

function WhyBlckole({ items }: { items?: WhyChooseItem[] }) {
  const displayItems = items && items.length > 0 ? items : brandValues;

  return (
    <section className={styles.whySection} aria-labelledby="why-blckole-title">
      <div className={styles.whyIntro}>
        <p className={styles.whyEyebrow}>System values</p>
        <h2 id="why-blckole-title" className={styles.whyTitle}>
          <span>why</span> BLCKOLE?
        </h2>
        <p className={styles.whyLead}>
          Built for people who want the garment, the fit, and the ritual to feel
          intentional before it reaches the bag.
        </p>
      </div>

      <div className={styles.valueGrid}>
        {displayItems.map((item, index) => (
          <article key={item.title} className={styles.valueItem}>
            <div className={styles.valueMarker} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className={styles.valueContent}>
              <p className={styles.valueMeta}>{item.subtitle}</p>
              <h3 className={styles.valueTitle}>{item.title}</h3>
              <p className={styles.valueText}>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomeScene({
  content,
  showcaseCollections,
  carouselProducts,
  serviceBarItems,
  whyChooseItems,
  brandQuoteContent,
  brandStatementContent,
  brandValueItems,
  footerContent,
}: Props) {
  return (
    <div style={{ position: "relative" }}>
      <div className={styles.mainFixed}>
        <ScrollStage content={content} />
      </div>

      <div className={styles.scrollableContent}>
        <TrustBar items={serviceBarItems} />
        <CollectionShowcase collections={showcaseCollections} />
        <ProductCarouselShowcase
          products={carouselProducts}
          backgroundImage="/bg-carousel.png"
        />
        <PressQuote content={brandQuoteContent} />
        <WhyBlckole items={whyChooseItems} />
        <Newsletter />
        <Principles items={brandValueItems} />
        <Manifesto content={brandStatementContent} />
        <Footer content={footerContent} />
      </div>
    </div>
  );
}
