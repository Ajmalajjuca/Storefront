"use client";

import { type MouseEvent } from "react";
import { useWishlist, type WishlistItem } from "./wishlist-context";
import styles from "./wishlist-button.module.css";

type Props = {
  item: WishlistItem;
  /** Visual treatment: an overlay chip on imagery, or an inline icon button. */
  variant?: "overlay" | "inline";
  className?: string;
};

export function WishlistButton({
  item,
  variant = "overlay",
  className,
}: Props) {
  const { has, toggle, ready } = useWishlist();
  const active = ready && has(item.handle);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    // The card is often a <Link>; don't navigate or submit when saving.
    event.preventDefault();
    event.stopPropagation();
    toggle(item);
  }

  return (
    <button
      type="button"
      className={[
        styles.button,
        variant === "inline" ? styles.inline : styles.overlay,
        active ? styles.active : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      aria-pressed={active}
      aria-label={
        active
          ? `Remove ${item.title} from wishlist`
          : `Save ${item.title} to wishlist`
      }
      title={active ? "Saved" : "Save to wishlist"}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          d="M12 20.5 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13L12 20.5Z"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
