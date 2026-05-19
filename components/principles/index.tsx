import type { BrandValueItem } from "lib/shopify/types";
import styles from "./index.module.css";

const ITEMS: BrandValueItem[] = [
  {
    num: "01",
    name: "Presence",
    desc: "Stillness that reads before you speak.",
    sortOrder: 1,
  },
  {
    num: "02",
    name: "Identity",
    desc: "Signature over novelty — the long arc over the short hit.",
    sortOrder: 2,
  },
  {
    num: "03",
    name: "Gravity",
    desc: "The pull is emotional first. The clothes simply agree.",
    sortOrder: 3,
  },
  {
    num: "04",
    name: "Permanence",
    desc: "Cut and cloth meant to age with you, not expire on you.",
    sortOrder: 4,
  },
  {
    num: "05",
    name: "Anonymity",
    desc: "Power without performance — recognition without announcement.",
    sortOrder: 5,
  },
];

export function Principles({ items }: { items?: BrandValueItem[] }) {
  const displayItems = items && items.length > 0 ? items : ITEMS;

  return (
    <section className={styles.section} aria-label="Principles">
      <div className={styles.grid}>
        {displayItems.map((p) => (
          <div key={p.num} className={styles.cell}>
            <div className={styles.num}>— {p.num}</div>
            <div className={styles.name}>{p.name}</div>
            <div className={styles.desc}>{p.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
