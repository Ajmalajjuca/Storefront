import { Footer } from "components/footer";
import {
  CURRENCY_COUNTRY_COOKIE,
  getMarketByCurrencyOrCountry,
  type SupportedCurrencyCode,
} from "lib/currency";
import { getExchangeRates } from "lib/exchange-rates";
import { formatMoney } from "lib/money";
import { getProduct } from "lib/shopify";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { NotifyForm } from "./notify-form";
import styles from "./page.module.css";

const fallbackImage = "/bg-carousel1.png";

function humanizeHandle(handle: string) {
  const cleaned = handle.replace(/[-_]+/g, " ").trim();
  if (!cleaned || cleaned === "next drop") return "The Next Drop";
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

function resolveDisplayCurrency(
  currency?: string,
): SupportedCurrencyCode | undefined {
  if (!currency) return undefined;
  return getMarketByCurrencyOrCountry(currency).currencyCode;
}

async function resolveDrop(
  handle: string,
  displayCurrencyCode?: SupportedCurrencyCode,
) {
  const [product, rates] = await Promise.all([
    getProduct(handle).catch(() => null),
    getExchangeRates(),
  ]);
  const price = product?.priceRange?.minVariantPrice;

  return {
    title: product?.title ?? humanizeHandle(handle),
    description:
      product?.description ||
      "An upcoming BLCKOLE release. Reserve your place and be the first to know the moment it goes live.",
    image:
      product?.featuredImage?.url ?? product?.images?.[0]?.url ?? fallbackImage,
    imageAlt:
      product?.featuredImage?.altText ?? product?.title ?? "Upcoming drop",
    price:
      price && product
        ? formatMoney({
            amount: price.amount,
            currencyCode: price.currencyCode,
            displayCurrencyCode,
            rates,
          })
        : undefined,
  };
}

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await props.params;
  const drop = await resolveDrop(handle);

  return {
    title: `Prebook · ${drop.title}`,
    description: `Prebook ${drop.title} and get notified the moment this BLCKOLE drop goes live.`,
    // Upcoming pieces shouldn't be indexed until they launch.
    robots: { index: false, follow: true },
  };
}

export default async function PrebookPage(props: {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ currency?: string }>;
}) {
  const { handle } = await props.params;
  const searchParams = await props.searchParams;
  const cookieStore = await cookies();
  const savedCurrencyCountry = cookieStore.get(CURRENCY_COUNTRY_COOKIE)?.value;
  const drop = await resolveDrop(
    handle,
    resolveDisplayCurrency(searchParams?.currency ?? savedCurrencyCountry),
  );

  return (
    <>
      <main className={styles.page}>
        <div className={styles.aura} aria-hidden="true" />

        <div className={styles.inner}>
          <Link href="/" className={styles.back}>
            <span aria-hidden="true">&lsaquo;</span> Back to store
          </Link>

          <div className={styles.grid}>
            <div className={styles.media}>
              <Image
                src={drop.image}
                alt={drop.imageAlt}
                fill
                sizes="(max-width: 900px) 92vw, 46vw"
                className={styles.mediaImage}
                priority
              />
              <span className={styles.badge}>Next drop</span>
            </div>

            <div className={styles.detail}>
              <p className={styles.eyebrow}>Upcoming Collection</p>
              <h1 className={styles.title}>{drop.title}</h1>
              {drop.price ? (
                <p className={styles.price}>{drop.price}</p>
              ) : (
                <p className={styles.priceTba}>Price revealed at drop</p>
              )}

              <p className={styles.lede}>{drop.description}</p>

              <div className={styles.notifyBlock}>
                <h2 className={styles.notifyHeading}>
                  Prebook &amp; get notified
                </h2>
                <p className={styles.notifyDek}>
                  Drop your email — we&apos;ll reserve your place in line and
                  send one message the moment it launches. No noise.
                </p>
                <NotifyForm />
              </div>

              <ul className={styles.perks}>
                <li className={styles.perk}>Priority early access</li>
                <li className={styles.perk}>One alert, no spam</li>
                <li className={styles.perk}>Unsubscribe anytime</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
