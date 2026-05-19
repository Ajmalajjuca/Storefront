import type { BrandQuoteContent } from "lib/shopify/types";
import styles from "./index.module.css";

export function PressQuote({ content }: { content?: BrandQuoteContent }) {
  return (
    <section className={styles.section}>
      <blockquote className={styles.quote}>
        {content?.quote ??
          "Quiet in the cut, loud in the detail — BLCKHOLE is what you wear when you do not need to explain the room you walked into."}
      </blockquote>
      <cite className={styles.cite}>
        {content?.cite ?? "Reader submission"}
      </cite>
    </section>
  );
}
