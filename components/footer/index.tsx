import type { FooterContent } from "lib/shopify/types";
import Link from "next/link";
import styles from "./index.module.css";

const LEGAL = [
  { label: "SHIPPING", href: "/shipping-policy" },
  { label: "PRIVACY", href: "/privacy-policy" },
  { label: "TERMS", href: "/terms-of-service" },
];

const SOCIAL = [
  { label: "INSTAGRAM", href: "https://instagram.com/blckole" },
  // { label: "TIKTOK", href: "https://www.tiktok.com/@blckole" },
  // { label: "PRESS", href: "/page/press" },
];

const YEAR = new Date().getFullYear();

export function Footer({ content }: { content?: FooterContent }) {
  console.log("footer content:", content);
  const social = [
    {
      label: content?.instagramLabel ?? SOCIAL[0]!.label,
      href: content?.instagramLink ?? SOCIAL[0]!.href,
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.lockup}>
        <img
          src="/logo-lockup-white.png"
          alt="BLCKHOLE"
          className={styles.logo}
        />
      </div>
      <p className={styles.tag}>
        {content?.tagline ?? "You always find your way back"}
      </p>

      <nav className={styles.legal} aria-label="Legal">
        {LEGAL.map((l) => (
          <Link key={l.label} href={l.href} className={styles.link}>
            {l.label}
          </Link>
        ))}
      </nav>

      <nav className={styles.social} aria-label="Social">
        {social.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className={styles.link}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <p className={styles.copyright}>
        {content?.copyright ??
          `© ${YEAR} BLCKHOLE STUDIO · ALL RIGHTS RESERVED`}
      </p>
    </footer>
  );
}
