"use client";

import { BottomBar } from "components/bottom-bar";
import { Footer } from "components/footer";
import { ScrollStage } from "components/scroll-stage";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { Product } from "lib/shopify/types";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

type Props = {
  products: Product[];
  recommendationsMap?: Record<string, Product[]>;
  initialHandle?: string;
};

export function HomeScene({ products, recommendationsMap = {}, initialHandle }: Props) {
  const { scrollY } = useScroll();

  const [vh, setVh] = useState(800);
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    if (initialHandle) {
      const idx = products.findIndex((p) => p.handle === initialHandle);
      return idx !== -1 ? idx : null;
    }
    return null;
  });
  const [currentFrame, setCurrentFrame] = useState(0);

  const [isExpanded, setIsExpanded] = useState(false);

  function handleSelect(index: number | null) {
    setSelectedIndex(index);
    setCurrentFrame(0);
    setIsExpanded(false);

    // Update URL without triggering Next.js hard navigation
    if (index !== null && products[index]) {
      History.prototype.pushState.apply(window.history, [null, "", `/looks/${products[index].handle}`]);
    } else {
      History.prototype.pushState.apply(window.history, [null, "", `/`]);
    }
  }

  // Prevent page scroll when in detail view to stop footer from overlapping
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/") {
        setSelectedIndex(null);
        setIsExpanded(false);
      } else if (path.startsWith("/looks/")) {
        const handle = path.replace("/looks/", "");
        const idx = products.findIndex((p) => p.handle === handle);
        if (idx !== -1) {
          setSelectedIndex(idx);
          setIsExpanded(false);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [products]);

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
          currentFrame={currentFrame}
          onFrameChange={setCurrentFrame}
          onModelClick={() => setIsExpanded((prev) => !prev)}
        />
      </motion.div>

      <BottomBar 
        count={products.length} 
        selectedProduct={selectedProduct} 
        relatedProducts={selectedProduct ? recommendationsMap[selectedProduct.id] : undefined}
        isExpanded={isExpanded}
        onClose={() => setIsExpanded(false)}
      />

      <motion.div style={{ y: footerY }} className={styles.footerSlider}>
        <Footer />
      </motion.div>
    </>
  );
}
