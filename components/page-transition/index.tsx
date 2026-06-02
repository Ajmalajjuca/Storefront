"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

type Props = { children: React.ReactNode };

export function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the previous pathname so we only fire the fade on actual route
  // changes. The previous implementation also re-keyed the wrapper div on
  // pathname, which caused the entire subtree to unmount and remount.
  const prevPathRef = useRef<string | null>(null);

  useGSAP(
    () => {
      const prev = prevPathRef.current;
      prevPathRef.current = pathname;
      // Skip the very first paint (no previous path) and any same-path call.
      if (prev === null || prev === pathname) return;
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          clearProps: "opacity",
        },
      );
    },
    { scope: containerRef, dependencies: [pathname], revertOnUpdate: true },
  );

  return <div ref={containerRef}>{children}</div>;
}
