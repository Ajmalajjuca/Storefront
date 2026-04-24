import Link from "next/link";
import styles from "./index.module.css";

const { COMPANY_NAME, SITE_NAME } = process.env;

export function Footer() {
  const year = new Date().getFullYear();
  const name = COMPANY_NAME ?? SITE_NAME ?? "Bécane";

  return (
    <footer className={styles.wrapper}>
      <p className={styles.manifesto}>
        Born on the road, made for the city. Technical, protective and
        unapologetically feminine.
      </p>

      <div className={styles.links}>
        <div className={styles.linkGroup}>
          <Link href="/page/terms-of-service" className={styles.link}>
            Terms of Service
          </Link>
          <Link href="/page/shipping-policy" className={styles.link}>
            Shipping Policy
          </Link>
          <Link href="/page/size-guide" className={styles.link}>
            Size Guide
          </Link>
        </div>

        <div className={`${styles.linkGroup} ${styles.rightGroup}`}>
          <a href="mailto:contact@becane.com" className={styles.link}>
            Contact
          </a>
          <a
            href="https://instagram.com/becaneparis"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Instagram
          </a>
          <span className={styles.copyright}>
            &copy; {year} {name}
          </span>
        </div>
      </div>
    </footer>
  );
}
