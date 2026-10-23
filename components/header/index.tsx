"use client";

import {
  Bars3Icon,
  BookOpenIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useWishlist } from "components/wishlist/wishlist-context";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";
import { CurrencySelector } from "./currency-selector";
import styles from "./index.module.css";

type NavChild = {
  title: string;
  href: string;
};

type NavItem = {
  title: string;
  href: string;
  count?: number;
  children?: NavChild[];
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

// Submenu hrefs already carry a `?category=` param, so the currency has to be
// appended rather than assumed to be the first query param.
function withCurrency(href: string, currency: string | null) {
  if (!currency || isExternalHref(href)) return href;
  return `${href}${href.includes("?") ? "&" : "?"}currency=${encodeURIComponent(currency)}`;
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
  const href = withCurrency(item.href, currency);
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

function NavSubmenu({
  items,
  labelledBy,
  className,
  onNavigate,
}: {
  items: NavChild[];
  labelledBy: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const searchParams = useSearchParams();
  const currency = searchParams.get("currency");

  return (
    <ul className={className} aria-label={labelledBy}>
      {items.map((child) => (
        <li key={child.href}>
          <Link
            href={withCurrency(child.href, currency)}
            className={styles.submenuLink}
            onClick={onNavigate}
          >
            {child.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Renders a nav entry plus, when it has children, the hover/focus dropdown.
// The open state is owned by React rather than CSS :hover, so that selecting a
// child can close the panel while the pointer is still resting on it.
function NavEntry({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const search = useSearchParams().toString();

  // Any navigation — including a query-only one between two categories —
  // dismisses the panel.
  useEffect(() => {
    setOpen(false);
  }, [pathname, search]);

  if (!item.children?.length) {
    return <NavLink item={item} />;
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  }

  return (
    <div
      className={`${styles.navGroup} ${open ? styles.navGroupOpen : ""}`}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={handleBlur}
    >
      <NavLink item={item} />
      <NavSubmenu
        items={item.children}
        labelledBy={item.title}
        className={styles.submenu}
        onNavigate={() => setOpen(false)}
      />
    </div>
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
  const headerRef = useRef<HTMLElement>(null);
  const lastPointer = useRef({ x: 0, y: 0, time: 0 });
  const pathname = usePathname();
  const { count: wishlistCount, ready: wishlistReady } = useWishlist();

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

  function handleGlassPointerMove(event: PointerEvent<HTMLElement>) {
    const header = headerRef.current;
    if (!header) return;

    const rect = header.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const now = performance.now();
    const elapsed = Math.max(now - lastPointer.current.time, 16);
    const distance = Math.hypot(
      x - lastPointer.current.x,
      y - lastPointer.current.y,
    );
    const velocity = Math.min(distance / elapsed, 1);

    header.style.setProperty("--glass-x", `${x}px`);
    header.style.setProperty("--glass-y", `${y}px`);
    header.style.setProperty(
      "--glass-lens-alpha",
      (0.05 + velocity * 0.07).toFixed(3),
    );
    header.style.setProperty(
      "--glass-lens-scale",
      (1.05 + velocity * 0.05).toFixed(4),
    );
    header.style.setProperty(
      "--glass-caustic-opacity",
      (0.28 + velocity * 0.22).toFixed(3),
    );
    header.style.setProperty(
      "--glass-specular-opacity",
      (0.5 + velocity * 0.25).toFixed(3),
    );
    header.style.setProperty(
      "--glass-chroma-opacity",
      (0.45 + velocity * 0.4).toFixed(3),
    );
    lastPointer.current = { x, y, time: now };
  }

  function handleGlassPointerLeave() {
    const header = headerRef.current;
    if (!header) return;

    header.style.setProperty("--glass-lens-alpha", "0.05");
    header.style.setProperty("--glass-lens-scale", "1.05");
    header.style.setProperty("--glass-caustic-opacity", "0.28");
    header.style.setProperty("--glass-specular-opacity", "0.5");
    header.style.setProperty("--glass-chroma-opacity", "0.45");
  }

  return (
    <>
      <header
        ref={headerRef}
        className={styles.header}
        onPointerMove={handleGlassPointerMove}
        onPointerLeave={handleGlassPointerLeave}
      >
        <svg className={styles.glassFilter} aria-hidden>
          <defs>
            {/* Soft noise warp used by the caustic highlights. */}
            <filter
              id="liquid-glass-distortion"
              x="-20%"
              y="-40%"
              width="140%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.035"
                numOctaves="2"
                seed="9"
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="14s"
                  values="0.008 0.035;0.012 0.026;0.008 0.035"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feGaussianBlur
                in="noise"
                stdDeviation="0.6"
                result="softNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="softNoise"
                scale="18"
                xChannelSelector="R"
                yChannelSelector="B"
              />
            </filter>

            {/* True liquid refraction: the live noise field displaces the
              backdrop, and each colour channel is displaced by a different
              amount to produce genuine chromatic aberration of whatever
              cosmic content scrolls behind the glass. */}
            <filter
              id="liquid-glass-refract"
              x="-30%"
              y="-60%"
              width="160%"
              height="220%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.009 0.016"
                numOctaves="2"
                seed="7"
                result="turb"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="18s"
                  values="0.009 0.016;0.013 0.011;0.009 0.016"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feGaussianBlur in="turb" stdDeviation="1.4" result="warp" />

              <feDisplacementMap
                in="SourceGraphic"
                in2="warp"
                scale="26"
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispR"
              />
              <feColorMatrix
                in="dispR"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="chanR"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="warp"
                scale="19"
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispG"
              />
              <feColorMatrix
                in="dispG"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="chanG"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="warp"
                scale="12"
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispB"
              />
              <feColorMatrix
                in="dispB"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="chanB"
              />

              <feBlend in="chanR" in2="chanG" mode="screen" result="rg" />
              <feBlend in="rg" in2="chanB" mode="screen" />
            </filter>
          </defs>
        </svg>
        <span className={styles.glassStack} aria-hidden>
          <span className={styles.glassFrost} />
          <span className={styles.glassRefraction} />
          <span className={styles.glassChroma} />
          <span className={styles.glassCaustics} />
          <span className={styles.glassLens} />
          <span className={styles.glassSpecular} />
        </span>

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
            <NavEntry key={`${item.title}-${item.href}`} item={item} />
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
          <Link
            href="/wishlist"
            className={styles.cartBtn}
            aria-label={`Open wishlist, ${wishlistReady ? wishlistCount : 0} items`}
            data-label="Wishlist"
          >
            <HeartIcon className={styles.navIcon} aria-hidden />
            <span className={styles.navLabel}>Wishlist</span>
            {wishlistReady && wishlistCount > 0 ? (
              <span className={styles.navCount}>{wishlistCount}</span>
            ) : null}
          </Link>
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
      </header>

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
              <div
                key={`mobile-left-${item.title}`}
                className={styles.mobileNavGroup}
              >
                <NavLink item={item} />
                {item.children?.length ? (
                  <NavSubmenu
                    items={item.children}
                    labelledBy={item.title}
                    className={styles.mobileSubmenu}
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                ) : null}
              </div>
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
    </>
  );
}
