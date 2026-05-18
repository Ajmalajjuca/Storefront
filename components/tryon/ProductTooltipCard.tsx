"use client";

import { useDisplayMoney } from "components/currency/use-display-money";
import type { TryOnUiProduct } from "components/tryon/tryon-products";
import styles from "components/tryon/tryon.module.css";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  product: TryOnUiProduct | null;
};

const MotionLink = motion.create(Link);

export function ProductTooltipCard({ product }: Props) {
  const formatPrice = useDisplayMoney();
  const [showImage, setShowImage] = useState(Boolean(product?.thumbnail));

  useEffect(() => {
    setShowImage(Boolean(product?.thumbnail));
  }, [product?.thumbnail]);

  if (!product) {
    return <AnimatePresence />;
  }

  const cardClassName = `${styles.tooltipCard} ${
    product.type === "topwear" ? styles.tooltipTop : styles.tooltipBottom
  }`;
  const cardMotion = {
    initial: { opacity: 0, x: -18, scale: 0.96 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -14, scale: 0.97 },
    transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] },
  } as const;
  const cardContent = (
    <>
      <span className={styles.tooltipCorner} aria-hidden="true" />
      <span className={styles.tooltipHudHeader}>
        <span className={styles.tooltipPulse} aria-hidden="true" />
        {`// ${product.type === "topwear" ? "TOPWEAR" : "BOTTOMWEAR"} // ACTIVE`}
      </span>
      <div className={styles.tooltipThumb}>
        {showImage ? (
          <img
            src={product.thumbnail}
            alt=""
            aria-hidden="true"
            onError={() => setShowImage(false)}
          />
        ) : null}
        <span className={styles.tooltipScan} aria-hidden="true" />
      </div>
      <div className={styles.tooltipMeta}>
        <h3>{product.name}</h3>
        <strong>{formatPrice(product.price, product.currencyCode)}</strong>
        <span className={styles.tooltipLink}>View</span>
      </div>
      <span className={styles.tooltipConnector} aria-hidden="true" />
    </>
  );

  return (
    <AnimatePresence>
      {product.handle ? (
        <MotionLink
          key={product.id}
          href={`/products/${product.handle}`}
          className={`${cardClassName} ${styles.tooltipCardLink}`}
          aria-label={`View ${product.name}`}
          {...cardMotion}
        >
          {cardContent}
        </MotionLink>
      ) : (
        <motion.aside
          key={product.id}
          className={cardClassName}
          {...cardMotion}
        >
          {cardContent}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
