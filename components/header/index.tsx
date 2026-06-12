"use client";

import {
  Bars3Icon,
  BookOpenIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
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
  switch (title.toUpperCase()) {
    case "ENTRY":
      return <HomeIcon className={styles.navIcon} aria-hidden />;
    case "COLLECTION":
    case "COLLECTIONS":
      return <Squares2X2Icon className={styles.navIcon} aria-hidden />;
    case "STORY":
      return <BookOpenIcon className={styles.navIcon} aria-hidden />;
    case "SEARCH":
      return <MagnifyingGlassIcon className={styles.navIcon} aria-hidden />;
    case "ACCOUNT":
      return <UserIcon className={styles.navIcon} aria-hidden />;
    case "INSTAGRAM":
      return (
        <svg
          className={styles.navIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.25" />
          <circle
            cx="17.4"
            cy="6.7"
            r="0.8"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "REDDIT":
      return (
        <svg
          className={styles.navIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden
        >
          <path d="M8.2 13.2a1.35 1.35 0 1 0 0 .1m7.6-.1a1.35 1.35 0 1 0 0 .1" />
          <path d="M8.4 17c1.9 1.35 5.3 1.35 7.2 0M5.1 11.8a3.1 3.1 0 0 0-.1.8c0 3.25 3.15 5.9 7 5.9s7-2.65 7-5.9c0-.28-.03-.55-.1-.8" />
          <path d="M7.1 11.2A8.6 8.6 0 0 1 12 9.8c1.8 0 3.5.5 4.9 1.4M12 9.8l1-4.5 3.3.7" />
          <circle cx="18.1" cy="6.4" r="1.7" />
          <path d="M6.1 11.1a2.1 2.1 0 1 0-1.2 3.8m13-3.8a2.1 2.1 0 1 1 1.2 3.8" />
        </svg>
      );
    default:
      return null;
  }
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
      <span className={styles.navLabel}>{item.title}</span>
      {item.count !== undefined && (
        <span className={styles.navCount}>{item.count}</span>
      )}
    </>
  );

  const className = `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`;

  if (isExternalHref(href)) {
    const opensNewTab = ["INSTAGRAM", "REDDIT"].includes(
      item.title.toUpperCase(),
    );

    return (
      <a
        href={href}
        className={className}
        aria-label={item.title}
        data-label={item.title}
        target={opensNewTab ? "_blank" : undefined}
        rel={opensNewTab ? "noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      aria-label={item.title}
      aria-current={isActive ? "page" : undefined}
      data-label={item.title}
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
        data-label="Menu"
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
          aria-label={`Open cart, ${cartCount} items`}
          data-label="Cart"
        >
          <ShoppingBagIcon className={styles.navIcon} aria-hidden />
          <span className={styles.navLabel}>Cart</span>
          <span className={styles.navCount}>{cartCount}</span>
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
