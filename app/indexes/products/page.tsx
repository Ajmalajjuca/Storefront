import { Footer } from "components/footer";
import { getSelectedCountryCode } from "lib/currency-server";
import { getFooterContent, getProducts, getShopPageContent } from "lib/shopify";
import styles from "./page.module.css";
import { ShopGrid } from "./shop-grid";

export const metadata = {
  title: "Shop",
  description: "The full line — denim, tops, and layers.",
};

export default async function ProductsIndexPage(props: {
  searchParams?: Promise<{ currency?: string }>;
}) {
  const searchParams = await props.searchParams;
  const countryCode = await getSelectedCountryCode(searchParams?.currency);
  const [products, content, footerContent] = await Promise.all([
    getProducts({ countryCode }).catch(() => []),
    getShopPageContent().catch(() => undefined),
    getFooterContent().catch(() => undefined),
  ]);

  return (
    <>
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{content?.eyebrow ?? "Shop"}</p>
          <h1 className={styles.headline}>
            {content?.title ?? "The full line"}
          </h1>
          <p className={styles.dek}>
            {content?.description ??
              "Denim, tops, and layers — built to hold attention without asking for it."}
          </p>
        </header>

        <ShopGrid products={products} />
      </main>

      <Footer content={footerContent} />
    </>
  );
}
