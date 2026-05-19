"use client";

import dynamic from "next/dynamic";
import styles from "components/tryon/tryon.module.css";
import type { TryOnUiProduct } from "components/tryon/tryon-products";

const TryOnExperience = dynamic(
  () =>
    import("components/tryon/TryOnExperience").then((m) => m.TryOnExperience),
  {
    ssr: false,
    loading: () => (
      <main
        className={`${styles.experience} relative min-h-[100svh] overflow-hidden`}
      >
        <img
          className={styles.stageBackgroundImage}
          src="/tryon-stage-bg.png"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
        <div className={styles.stageAtmosphere} aria-hidden="true" />
      </main>
    ),
  },
);

type Props = {
  topwearProducts: TryOnUiProduct[];
  bottomwearProducts: TryOnUiProduct[];
};

export function TryOnExperienceClient(props: Props) {
  return <TryOnExperience {...props} />;
}
