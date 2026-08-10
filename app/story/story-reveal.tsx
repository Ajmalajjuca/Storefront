"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";
import styles from "./story-reveal.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: ReactNode;
  manifesto: ReactNode;
};

// The story sticks to the bottom of the viewport once the reader reaches its
// end, and the manifesto then slides up over it. The scrub below pushes the
// story back in depth as it gets covered, so the two layers read as parallax
// rather than as one block scrolling past another.
export function StoryReveal({ children, manifesto }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const storyLayerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const storyLayer = storyLayerRef.current;
      const story = storyRef.current;
      const manifestoLayer = manifestoRef.current;
      if (!storyLayer || !story || !manifestoLayer) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Created before the scrub below so the two refresh in page order.
        // pinSpacing:false is what lets the manifesto travel over the held
        // story instead of being pushed down past it.
        ScrollTrigger.create({
          trigger: storyLayer,
          start: "bottom bottom",
          endTrigger: manifestoLayer,
          end: "top top",
          pin: true,
          pinSpacing: false,
        });

        // Same scroll window as the pin: the story recedes exactly as much of
        // it as the manifesto has covered.
        gsap.to(story, {
          scale: 0.94,
          yPercent: -6,
          opacity: 0.28,
          ease: "none",
          scrollTrigger: {
            trigger: manifestoLayer,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={styles.wrap}>
      <div ref={storyLayerRef} className={styles.storyLayer}>
        <div ref={storyRef} className={styles.storyInner}>
          {children}
        </div>
      </div>
      <div ref={manifestoRef} className={styles.manifestoLayer}>
        {manifesto}
      </div>
    </div>
  );
}
