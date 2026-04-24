"use client";

import { useCart } from "components/cart/cart-context";
import { CartDrawer } from "components/cart/drawer";
import { Header } from "components/header";
import { PageTransition } from "components/page-transition";
import { useState } from "react";

type NavItem = {
  title: string;
  href: string;
  count?: number;
};

type Props = {
  navItems: NavItem[];
  children: React.ReactNode;
};

export function SiteShell({ navItems, children }: Props) {
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart?.totalQuantity ?? 0;

  return (
    <>
      <Header
        navItems={navItems}
        cartCount={cartCount}
        onCartClick={() => setCartOpen((v) => !v)}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main style={{ paddingTop: "var(--header-height)" }}>
        <PageTransition>{children}</PageTransition>
      </main>
    </>
  );
}
