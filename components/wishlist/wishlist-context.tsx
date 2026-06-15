"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "blckole_wishlist_v1";

// A lightweight snapshot so the wishlist page can render instantly (and offline)
// without re-fetching every product. `handle` is the stable identity.
export type WishlistItem = {
  handle: string;
  title: string;
  image?: string;
  imageAlt?: string;
  priceAmount?: number;
  priceCurrencyCode?: string;
};

type WishlistContextType = {
  items: WishlistItem[];
  count: number;
  /** True once we've read localStorage on the client — guards SSR mismatch. */
  ready: boolean;
  has: (handle: string) => boolean;
  add: (item: WishlistItem) => void;
  remove: (handle: string) => void;
  toggle: (item: WishlistItem) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

function readStorage(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is WishlistItem =>
        entry && typeof entry.handle === "string",
    );
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage after mount (never during SSR).
  useEffect(() => {
    setItems(readStorage());
    setReady(true);
  }, []);

  // Persist on change, but only after the initial hydration so we don't clobber.
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full / unavailable — ignore
    }
  }, [items, ready]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setItems(readStorage());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const has = useCallback(
    (handle: string) => items.some((item) => item.handle === handle),
    [items],
  );

  const add = useCallback((item: WishlistItem) => {
    setItems((current) =>
      current.some((existing) => existing.handle === item.handle)
        ? current
        : [item, ...current],
    );
  }, []);

  const remove = useCallback((handle: string) => {
    setItems((current) => current.filter((item) => item.handle !== handle));
  }, []);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((current) =>
      current.some((existing) => existing.handle === item.handle)
        ? current.filter((existing) => existing.handle !== item.handle)
        : [item, ...current],
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextType>(
    () => ({
      items,
      count: items.length,
      ready,
      has,
      add,
      remove,
      toggle,
      clear,
    }),
    [items, ready, has, add, remove, toggle, clear],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
