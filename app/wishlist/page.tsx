import { Footer } from "components/footer";
import type { Metadata } from "next";
import { WishlistClient } from "./wishlist-client";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Pieces you've saved on BLCKOLE.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <main>
        <WishlistClient />
      </main>
      <Footer />
    </>
  );
}
