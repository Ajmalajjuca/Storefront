"use client";

import Link from "next/link";
import styles from "./index.module.css";

type NavItem = {
  title: string;
  href: string;
  count?: number;
};

type Props = {
  navItems?: NavItem[];
  cartCount?: number;
  onCartClick?: () => void;
  collectionLabel?: string;
};

function fmt(n: number) {
  return n.toString().padStart(2, "0");
}

export function Header({
  navItems = [],
  cartCount = 0,
  onCartClick,
  collectionLabel,
}: Props) {
  return (
    <>
      {/* ── Small panel: top-left ─────────────────────── */}
      <div className={styles.panel}>
        {/* Logo row */}
        <div className={styles.logoRow}>
          <Link
            href="/"
            className={styles.logoLink}
          >
            <span className={styles.logoText}>BECANE</span>
          </Link>
        </div>

        {/* Nav row */}
        <div className={styles.navRow}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.title}
              {item.count !== undefined && (
                <span className={styles.navCount}>{fmt(item.count)}</span>
              )}
            </Link>
          ))}

          <button className={styles.cartBtn} onClick={onCartClick}>
            CART
            <span className={styles.navCount}>{fmt(cartCount)}</span>
          </button>
        </div>
      </div>

      {/* ── Top-right: collection info ────────────────── */}
      {collectionLabel && (
        <div className={styles.topRight}>
          <span className={styles.collectionLabel}>{collectionLabel}</span>
          <span
            className={styles.profileIcon}
            aria-hidden="true"
            title="Profile"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="6"
                cy="4"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M1 11c0-2.761 2.239-5 5-5s5 2.239 5 5"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      )}
    </>
  );
}
