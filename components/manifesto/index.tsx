import type { BrandStatementContent } from "lib/shopify/types";
import styles from "./index.module.css";

const DEFAULT_BODY =
  "We drift, we orbit, we come back. BLCKHOLE is the reminder: some forces do not negotiate — they align you. The work is wardrobe as gravity — black, white, a controlled flash of red, and silhouettes that hold the room without asking for it.";

export function Manifesto({ content }: { content?: BrandStatementContent }) {
  const firstLine =
    content?.leftTitleLine1 ?? content?.leftTitleLine2 ?? "Not volume.";
  const secondLine = content?.leftTitleLine1
    ? (content.leftTitleLine2 ?? "Conviction.")
    : "Conviction.";
  const badgeText = content?.badgeText ?? "BK";
  const body = content?.body ?? DEFAULT_BODY;
  const establishedText = content?.establishedText ?? "Established 2024";

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.quote}>
          {firstLine}
          <br />
          {secondLine}
        </div>
        <div className={styles.right}>
          <p className={styles.body}>
            <span className={styles.pill}>{badgeText}</span>
            {body}
          </p>
          <p className={styles.meta}>{establishedText}</p>
        </div>
      </div>
    </section>
  );
}
