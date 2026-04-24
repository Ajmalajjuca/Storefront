"use client";

import { AnimatePresence, motion } from "framer-motion";
import styles from "./index.module.css";

type Props = {
  open: boolean;
  children: React.ReactNode;
};

export function Panel({ open, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
