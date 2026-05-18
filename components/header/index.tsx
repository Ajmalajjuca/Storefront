"use client";

import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CurrencySelector } from "./currency-selector";
import styles from "./index.module.css";

type NavItem = {
  title: string;
  href: string;
  count?: number;
};

type Props = {
  leftNavItems?: NavItem[];
  rightNavItems?: NavItem[];
  cartCount?: number;
  onCartClick?: () => void;
  logoSrc?: string;
  logoAlt?: string;
  locales?: string[];
};

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function NavIcon({ title }: { title: string }) {
  if (title === "SEARCH") {
    return <MagnifyingGlassIcon className={styles.navIcon} aria-hidden />;
  }
  if (title === "ACCOUNT") {
    return <UserIcon className={styles.navIcon} aria-hidden />;
  }
  return null;
}

function NavLink({ item }: { item: NavItem }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currency = searchParams.get("currency");
  const href =
    currency && !isExternalHref(item.href)
      ? `${item.href}?currency=${encodeURIComponent(currency)}`
      : item.href;
  const isActive =
    item.title === "ENTRY"
      ? pathname === "/"
      : !isExternalHref(item.href) &&
        item.href !== "/" &&
        Boolean(pathname?.startsWith(item.href));

  const content = (
    <>
      <NavIcon title={item.title} />
      {item.title}
      {item.count !== undefined && (
        <span className={styles.navCount}>{item.count}</span>
      )}
    </>
  );

  const className = `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`;

  if (isExternalHref(href)) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </Link>
  );
}

export function Header({
  leftNavItems = [],
  rightNavItems = [],
  cartCount = 0,
  onCartClick,
  logoSrc = "/logo-lockup-white.png",
  logoAlt = "BLCKHOLE",
}: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.mobileMenuBtn}
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Bars3Icon className={styles.navIcon} aria-hidden />
      </button>

      <nav className={styles.zoneLeft} aria-label="Primary">
        {leftNavItems.map((item) => (
          <NavLink key={`${item.title}-${item.href}`} item={item} />
        ))}
      </nav>

      <Link href="/" className={styles.logoLink} aria-label={logoAlt}>
        <img src={logoSrc} alt={logoAlt} className={styles.logoImg} />
      </Link>

      <div className={styles.zoneRight}>
        <div className={styles.currencySelectorWrap}>
          <CurrencySelector />
        </div>
        <nav aria-label="Secondary" className={styles.zoneRightNav}>
          {rightNavItems.map((item) => (
            <NavLink key={`${item.title}-${item.href}`} item={item} />
          ))}
        </nav>
        <button
          type="button"
          className={styles.cartBtn}
          onClick={onCartClick}
          aria-label="Open cart"
        >
          <ShoppingBagIcon className={styles.navIcon} aria-hidden />
          CART
          <span className={styles.navCount}>({cartCount})</span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenuHeader}>
            <button
              type="button"
              className={styles.mobileMenuBtn}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <XMarkIcon className={styles.navIcon} aria-hidden />
            </button>
          </div>
          <nav className={styles.mobileMenuNav}>
            {leftNavItems.map((item) => (
              <NavLink key={`mobile-left-${item.title}`} item={item} />
            ))}
          </nav>
          <div className={styles.mobileMenuFooter}>
            {rightNavItems.map((item) => (
              <NavLink key={`mobile-right-${item.title}`} item={item} />
            ))}
            <CurrencySelector />
          </div>
        </div>
      )}
    </header>
  );
}
