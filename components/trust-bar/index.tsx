import type { ServiceBarItem } from "lib/shopify/types";
import styles from "./index.module.css";

const DEFAULT_ITEMS: ServiceBarItem[] = [
  { title: "Ship", description: "Free standard above ₹4,999", sortOrder: 1 },
  {
    title: "Dispatch",
    description: "In-stock orders within 48 hours",
    sortOrder: 2,
  },
  {
    title: "Returns",
    description: "14 days · unused with tags",
    sortOrder: 3,
  },
];

export function TrustBar({ items }: { items?: ServiceBarItem[] }) {
  const displayItems = items && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <section className={styles.bar} aria-label="Store policies">
      <div className={styles.inner}>
        {displayItems.map((item) => (
          <div key={`${item.title}-${item.sortOrder}`} className={styles.item}>
            <span className={styles.key}>{item.title}</span>
            <span className={styles.value}>{item.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
