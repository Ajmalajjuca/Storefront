"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { TextShuffle } from "components/text-shuffle";
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
};

function BecaneLogoSvg() {
  return (
    <svg
      viewBox="0 0 84 10"
      className={styles.logoSvg}
      aria-label="Bécane"
      role="img"
    >
      <text
        x="0"
        y="9"
        fontFamily="Barlow Condensed, sans-serif"
        fontSize="10"
        fontWeight="700"
        fontStretch="expanded"
        fill="currentColor"
        textLength="84"
        lengthAdjust="spacing"
        letterSpacing="0"
      >
        BÉCANE
      </text>
    </svg>
  );
}

export function Header({
  navItems = [],
  cartCount = 0,
  onCartClick,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const formattedCount = (n: number) =>
    n.toString().padStart(2, "0");

  return (
    <>
      <header className={styles.wrapper}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <TextShuffle text="BÉCANE" triggerOnHover />
        </Link>

        {/* Centre nav (desktop) */}
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.title}
              {item.count !== undefined && (
                <span className={styles.navCount}>
                  {formattedCount(item.count)}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={onCartClick}
            aria-label="Open cart"
          >
            Cart
            <span className={styles.cartCount}>
              {formattedCount(cartCount)}
            </span>
          </button>

          {/* Hamburger (mobile) */}
          <button
            className={`${styles.hamburger}${menuOpen ? ` ${styles.hamburgerOpen}` : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <Link
              href="/page/size-guide"
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              Size Guide
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
