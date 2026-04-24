import { Footer } from "components/footer";
import { getPage } from "lib/shopify";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(params.page);
  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  const params = await props.params;
  const page = await getPage(params.page);
  if (!page) return notFound();

  const formatted = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(page.updatedAt));

  return (
    <>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{page.title}</h1>
        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
        <p className={styles.updated}>Last updated {formatted}</p>
      </div>
      <Footer />
    </>
  );
}
