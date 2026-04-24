import { Footer } from "components/footer";
import { PageInfo } from "components/page-info";
import { getCollections } from "lib/shopify";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Collections",
};

export default async function CollectionsIndexPage() {
  const collections = await getCollections().catch(() => []);

  return (
    <>
      <PageInfo title="Collections" count={collections.length} />

      <div className={styles.wrapper}>
        <div className={styles.grid}>
          {collections.map((col) => (
            <Link
              key={col.handle}
              href={`/indexes/collections/${col.handle}`}
              className={styles.card}
            >
              <div className={styles.cardMedia}>
                {/* Collection image shown when available via Shopify metafields */}
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardTitle}>{col.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
