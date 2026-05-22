"use client";

import { Footer } from "components/footer";
import { Manifesto } from "components/manifesto";
import { Newsletter } from "components/newsletter";
import { PressQuote } from "components/press-quote";
import { Principles } from "components/principles";
import { ScrollStage } from "components/scroll-stage";
import { TrustBar } from "components/trust-bar";
import type {
  BrandQuoteContent,
  BrandStatementContent,
  BrandValueItem,
  FooterContent,
  HomeContent,
  Product,
  ServiceBarItem,
  WhyChooseItem,
} from "lib/shopify/types";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";

type Props = {
  products: Product[];
  recommendationsMap?: Record<string, Product[]>;
  content?: HomeContent;
  serviceBarItems?: ServiceBarItem[];
  whyChooseItems?: WhyChooseItem[];
  brandQuoteContent?: BrandQuoteContent;
  brandStatementContent?: BrandStatementContent;
  brandValueItems?: BrandValueItem[];
  footerContent?: FooterContent;
};

const categoryFeatures = [
  {
    title: "Topwear",
    description: "Oversized silhouettes, graphic weight, and everyday edge.",
    image: "/topwearr.png",
    width: 1895,
    height: 1271,
    href: "/indexes/products",
  },
  {
    title: "Bottom wear",
    description: "Wide shapes, grounded volume, and utility-led attitude.",
    image: "/bottomwear.png",
    width: 928,
    height: 1152,
    href: "/indexes/products",
  },
];

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
    title: "Personalized Virtual Try-On",
    description:
      "Preview the look on your selected avatar before you move from browse to bag.",
    subtitle: "Try before checkout",
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

function CategoryShowcase() {
  return (
    <section
      className={styles.categoryShowcase}
      aria-label="Featured categories"
    >
      {categoryFeatures.map((category) => (
        <article key={category.title} className={styles.categoryFeature}>
          <a
            href={category.href}
            className={styles.categoryImageLink}
            aria-label={`Shop ${category.title}`}
          >
            <Image
              src={category.image}
              alt={`${category.title} collection`}
              width={category.width}
              height={category.height}
              sizes="100vw"
              className={styles.categoryImage}
            />
          </a>
          <div className={styles.categoryTitleTrack} aria-hidden="true">
            <span className={styles.categoryTitle}>{category.title}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

export function HomeScene({
  products,
  recommendationsMap,
  content,
  serviceBarItems,
  whyChooseItems,
  brandQuoteContent,
  brandStatementContent,
  brandValueItems,
  footerContent,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const indexFromPathname = useCallback(
    (path: string | null): number | null => {
      if (!path?.startsWith("/looks/")) return null;
      const handle = path.slice("/looks/".length);
      const idx = products.findIndex((p) => p.handle === handle);
      return idx === -1 ? null : idx;
    },
    [products],
  );

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const fromPath = indexFromPathname(pathname);
    return fromPath ?? 0;
  });
  const [detailOpen, setDetailOpen] = useState<boolean>(() =>
    Boolean(pathname?.startsWith("/looks/")),
  );
  // Recs always start collapsed. The user has to tap the model to expand.
  const [recsOpen, setRecsOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const fromPath = indexFromPathname(pathname);
    if (fromPath !== null) {
      setCurrentIndex(fromPath);
      setDetailOpen(true);
      setRecsOpen(false);
    } else {
      setDetailOpen(false);
      setRecsOpen(false);
    }
  }, [pathname, indexFromPathname]);

  useEffect(() => {
    const handleCartOpenChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ open?: boolean }>;
      setCartOpen(Boolean(customEvent.detail?.open));
    };

    setCartOpen(document.body.dataset.cartOpen === "true");
    window.addEventListener("cart-open-change", handleCartOpenChange);
    return () => {
      window.removeEventListener("cart-open-change", handleCartOpenChange);
    };
  }, []);

  useEffect(() => {
    products.forEach((p) => router.prefetch(`/looks/${p.handle}`));
  }, [products, router]);

  const lastUserInteractionRef = useRef(0);
  const detailOpenRef = useRef(detailOpen);
  useEffect(() => {
    detailOpenRef.current = detailOpen;
  }, [detailOpen]);

  const handleSelect = useCallback(
    (index: number, opts?: { open?: boolean; userInitiated?: boolean }) => {
      const open = opts?.open ?? false;
      const userInitiated = opts?.userInitiated ?? true;
      if (userInitiated) {
        lastUserInteractionRef.current = Date.now();
      }
      setCurrentIndex(index);

      const target = products[index] ? `/looks/${products[index].handle}` : "/";

      if (open) {
        setDetailOpen(true);
        setRecsOpen(false);
        if (target !== pathname) {
          router.push(target, { scroll: false });
        }
        return;
      }

      // Just an index change (swipe / thumbnail click). Keep current
      // detail/recs state. If detail is already open, sync the URL.
      if (detailOpenRef.current) {
        if (target !== pathname) {
          window.history.replaceState(null, "", target);
        }
      }
    },
    [products, pathname, router],
  );

  const handleClose = useCallback(() => {
    lastUserInteractionRef.current = Date.now();
    setDetailOpen(false);
    setRecsOpen(false);
    if (pathname !== "/") {
      router.replace("/", { scroll: false });
    }
  }, [pathname, router]);

  const handleToggleRecs = useCallback(() => {
    lastUserInteractionRef.current = Date.now();
    setRecsOpen((prev) => !prev);
  }, []);

  // Auto-advance through characters. Pauses for 12s after any user
  // interaction and stops entirely while the detail mode is active.
  const AUTO_ADVANCE_MS = 5500;
  const PAUSE_AFTER_INTERACTION_MS = 12000;

  useEffect(() => {
    if (products.length === 0) return;
    const id = setInterval(() => {
      if (cartOpen) return;
      if (detailOpenRef.current) return;
      if (
        Date.now() - lastUserInteractionRef.current <
        PAUSE_AFTER_INTERACTION_MS
      ) {
        return;
      }
      setCurrentIndex((cur) => (cur + 1) % products.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [cartOpen, products]);

  return (
    <div style={{ position: "relative" }}>
      <div
        className={styles.mainFixed}
        data-detail-open={detailOpen ? "true" : "false"}
      >
        <ScrollStage
          products={products}
          recommendationsMap={recommendationsMap}
          currentIndex={currentIndex}
          detailOpen={detailOpen}
          recsOpen={recsOpen}
          paused={cartOpen}
          onSelect={handleSelect}
          onClose={handleClose}
          onToggleRecs={handleToggleRecs}
          content={content}
        />
      </div>

      {!detailOpen && (
        <div className={styles.scrollableContent}>
          <TrustBar items={serviceBarItems} />
          <CategoryShowcase />
          <PressQuote content={brandQuoteContent} />
          <WhyBlckole items={whyChooseItems} />
          <Newsletter />
          <Principles items={brandValueItems} />
          <Manifesto content={brandStatementContent} />
          <Footer content={footerContent} />
        </div>
      )}
    </div>
  );
}
