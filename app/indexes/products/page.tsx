import { Footer } from "components/footer";
import { getSelectedCountryCode } from "lib/currency-server";
import { getFooterContent, getProducts, getShopPageContent } from "lib/shopify";
import styles from "./page.module.css";
import { ShopGrid } from "./shop-grid";

export const metadata = {
  title: "Shop",
  description: "The full line of denim, tops, and layers.",
};

export default async function ProductsIndexPage(props: {
  searchParams?: Promise<{ currency?: string; category?: string }>;
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
              "Denim, tops, and layers built to hold attention without asking for it."}
          </p>
        </header>

        {/* Keyed on the category so arriving from the header dropdown while
            already on this page resets the grid's selected chip. */}
        <ShopGrid
          key={searchParams?.category ?? ""}
          products={products}
          initialCategory={searchParams?.category}
        />
      </main>

      <Footer content={footerContent} />
    </>
  );
}
