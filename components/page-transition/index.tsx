"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

type Props = { children: React.ReactNode };

export function PageTransition({ children }: Props) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
