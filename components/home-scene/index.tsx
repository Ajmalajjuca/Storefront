"use client";

import { CollectionShowcase } from "components/collection-showcase";
import { Footer } from "components/footer";
import { Manifesto } from "components/manifesto";
import { Newsletter } from "components/newsletter";
import { PressQuote } from "components/press-quote";
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
    title: "Artist Based",
    description:
      "Created through a visual language shaped by artists, outsiders, and independent thought.",
    subtitle: "Creative expression",
    sortOrder: 4,
  },
];

const brandStory = [
  "Inside every one of us is an unknown waiting to become a universe.",
  "A space filled with unfinished dreams, untold stories, unanswered questions, and endless possibilities.",
  "Most people fear it.",
  "We call it BLCKOLE.",
  "Born for the bold, the curious, the creators, and the outsiders, BLCKOLE is more than clothing, it's a reminder that growth begins in the unknown.",
  "We don't follow trends. We don't chase perfection.",
  "We create for those becoming who they're meant to be.",
  "Because every scar tells a story. Every risk creates a future. And every blank space holds a universe.",
  "Welcome to BLCKOLE.",
];

function WhyBlckole({ items }: { items?: WhyChooseItem[] }) {
  const displayItems = items && items.length > 0 ? items : brandValues;

  return (
    <section className={styles.whySection} aria-labelledby="why-blckole-title">
      <header className={styles.whyIntro}>
        <p className={styles.whyEyebrow}>System values</p>
        <h2 id="why-blckole-title" className={styles.whyTitle}>
          <span>Why</span>
          BLCKOLE?
        </h2>
      </header>

      <div className={styles.storyContent}>
        <p className={styles.storyLead}>{brandStory[0]}</p>

        <div className={styles.storyColumns}>
          <div className={styles.storyColumn}>
            {brandStory.slice(1, 5).map((paragraph, index) => (
              <p
                key={paragraph}
                className={index === 2 ? styles.storyCallout : undefined}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className={styles.storyColumn}>
            {brandStory.slice(5).map((paragraph, index) => (
              <p
                key={paragraph}
                className={
                  index === brandStory.slice(5).length - 1
                    ? styles.storyWelcome
                    : undefined
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <p className={styles.storyClosing}>
          <span>Wear your story.</span>
          <span>Create your own universe.</span>
        </p>
      </div>

      <div className={styles.valueStrip} aria-label="Brand values">
        {displayItems.slice(0, 4).map((item) => (
          <div key={item.title} className={styles.valueItem}>
            <span className={styles.valueTitle}>{item.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomeScene({
  content,
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
        <CollectionShowcase products={carouselProducts} />
        <ProductCarouselShowcase
          products={carouselProducts}
          backgroundImage="/bg-carousel1.png"
          visibleProductCount={5}
        />
        <PressQuote content={brandQuoteContent} />
        <WhyBlckole items={whyChooseItems} />
        <Newsletter />
        {/* <Principles items={brandValueItems} /> */}
        <Manifesto content={brandStatementContent} />
        <Footer content={footerContent} />
      </div>
    </div>
  );
}
