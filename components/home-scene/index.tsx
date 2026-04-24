"use client";

import { BottomBar } from "components/bottom-bar";
import { Footer } from "components/footer";
import { ProductQuickView } from "components/product-quick-view";
import { ScrollStage } from "components/scroll-stage";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { Product } from "lib/shopify/types";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

type Props = {
  products: Product[];
};

export function HomeScene({ products }: Props) {
  const { scrollY } = useScroll();

  const [vh, setVh] = useState(800);
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  function handleSelect(index: number | null) {
    setSelectedIndex(index);
    setCurrentFrame(0);
    setQuickViewOpen(false);
  }

  const footerY = useTransform(scrollY, [0, vh], ["100%", "0%"]);
  const mainOpacity = useTransform(scrollY, [0, vh], [1, 0]);

  const selectedProduct =
    selectedIndex !== null ? products[selectedIndex] : undefined;

  return (
    <>
      <div className={styles.spacer} />

      <motion.div style={{ opacity: mainOpacity }} className={styles.mainFixed}>
        <ScrollStage
          products={products}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          onQuickView={() => setQuickViewOpen(true)}
          currentFrame={currentFrame}
          onFrameChange={setCurrentFrame}
        />
      </motion.div>

      <BottomBar count={products.length} selectedProduct={selectedProduct} />

      <motion.div style={{ y: footerY }} className={styles.footerSlider}>
        <Footer />
      </motion.div>

      <AnimatePresence>
        {quickViewOpen && selectedProduct && (
          <ProductQuickView
            key={selectedProduct.id}
            product={selectedProduct}
            onClose={() => setQuickViewOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
