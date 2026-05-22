"use client";

import type { HomeContent, Product } from "lib/shopify/types";
import React, { type CSSProperties, useRef, useState } from "react";
import styles from "./index.module.css";

type Props = {
  products: Product[];
  recommendationsMap?: Record<string, Product[]>;
  currentIndex: number;
  detailOpen: boolean;
  recsOpen: boolean;
  paused?: boolean;
  content?: HomeContent;
  onSelect: (
    index: number,
    opts?: { open?: boolean; userInitiated?: boolean },
  ) => void;
  onClose: () => void;
  onToggleRecs: () => void;
};

const SWIPE_MIN_DISTANCE = 50;
const SWIPE_MAX_DURATION = 600;

const defaultHeroTitle = ["You always", "find your way", "back"];
const defaultHeroSubtitle = [
  "Preview streetwear on a 3D avatar, switch styles",
  "instantly, and choose your fit with confidence.",
];

const splitContentLines = (value: string | undefined, fallback: string[]) => {
  if (!value) return fallback;
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : fallback;
};

function HeroBackground({ style }: { style: CSSProperties | undefined }) {
  return <div className={styles.heroBackground} style={style} aria-hidden />;
}

function HeroCopy({ content }: { content?: HomeContent }) {
  const titleLines = splitContentLines(content?.heroTitle, defaultHeroTitle);
  const subtitleLines = splitContentLines(
    content?.heroSubtitle,
    defaultHeroSubtitle,
  );

  return (
    <section className={styles.textContent} aria-labelledby="hero-title">
      <p className={styles.heroEyebrow}>
        {content?.heroEyebrow ?? "You are being pulled in"}
      </p>
      <h1 id="hero-title" className={styles.heroHeadline}>
        {titleLines.map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </h1>
      <p className={styles.heroBody}>
        {subtitleLines.map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </p>
      {/* <a href="/story" className={styles.trailerLink}>
        <span className={styles.trailerIcon} aria-hidden="true" />
        Watch trailer
      </a> */}
    </section>
  );
}

function HeroCharacters() {
  return <div className={styles.heroCharacters} aria-hidden />;
}

function HeroCTA({
  content,
}: {
  content?: HomeContent;
  onSelectAvatar: () => void;
}) {
  return (
    <nav
      className={styles.heroHeadline}
      data-no-swipe
      aria-label="Hero actions"
    >
      <a
        href={content?.primaryButtonLink ?? "/indexes/products"}
        className={styles.secondaryAction}
      >
        <span>{content?.primaryButtonText ?? "Shop now"}</span>
      </a>
      <a
        href={content?.secondaryButtonLink ?? "/try-on"}
        className={styles.secondaryAction}
      >
        {content?.secondaryButtonText ?? "Select avatar"}
      </a>
      <a
        href={content?.thirdButtonLink ?? "/indexes/products"}
        className={styles.secondaryAction}
      >
        {content?.thirdButtonText ?? "Explore catalog"}
      </a>
    </nav>
  );
}

function ScrollIndicator({
  soundOn,
  onToggleSound,
  scrollText,
}: {
  soundOn: boolean;
  onToggleSound: () => void;
  scrollText?: string;
}) {
  return (
    <div className={styles.landingFooter} data-no-swipe>
      <button
        type="button"
        className={styles.soundStatus}
        aria-pressed={soundOn}
        onClick={onToggleSound}
      >
        {/* <span>Sound: {soundOn ? "on" : "off"}</span>
        <span className={styles.soundBars}>
          <span />
          <span />
          <span />
          <span />
        </span> */}
      </button>

      <div className={styles.scrollCue} aria-hidden="true">
        <span className={styles.mouseCue}>
          <span />
        </span>
        <span>{scrollText ?? "Scroll to enter"}</span>
      </div>
    </div>
  );
}

// function DetailCharacter({
//   layers,
//   paused,
//   onModelClick,
// }: {
//   layers: LayerEntry[];
//   paused: boolean;
//   onModelClick: () => void;
// }) {
//   return (
//     <div className={styles.mainCharacterWrapper}>
//       <div className={styles.floorGlow} aria-hidden="true" />
//       <div className={styles.mainCharacter}>
//         {layers.map((entry, i, arr) => {
//           const isLatest = i === arr.length - 1;
//           const cls = isLatest
//             ? entry.dir === -1
//               ? styles.charLayerInLeft
//               : entry.dir === 1
//                 ? styles.charLayerInRight
//                 : styles.charLayerInitial
//             : entry.dir === -1
//               ? styles.charLayerOutRight
//               : styles.charLayerOutLeft;
//           return (
//             <div
//               key={entry.product.id}
//               className={`${styles.charLayer} ${cls}`}
//             >
//               <RotatingFigure
//                 product={entry.product}
//                 listenToGlobalFrame={isLatest}
//                 priority={true}
//                 paused={paused}
//                 onClick={isLatest ? onModelClick : undefined}
//               />
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

export const ScrollStage = React.memo(function ScrollStage({
  products,
  recommendationsMap,
  currentIndex,
  detailOpen,
  recsOpen,
  paused = false,
  content,
  onSelect,
  onClose,
  onToggleRecs,
}: Props) {
  // Swipe navigation (pointer-based, both modes).
  const stageRef = useRef<HTMLElement>(null);

  const [soundOn, setSoundOn] = useState(true);
  const stageStyle = content?.heroImage?.url
    ? ({
        "--hero-image": `url("${content.heroImage.url}")`,
      } as CSSProperties)
    : undefined;

  return (
    <section
      ref={stageRef}
      className={styles.stage}
      style={stageStyle}
      aria-label="BLCKOLE entry campaign"
      data-detail-open={detailOpen ? "true" : "false"}
      data-recs-open={recsOpen ? "true" : "false"}
    >
      <div className={styles.leftPanel}>
        <HeroCopy content={content} />
      </div>

      <HeroBackground style={stageStyle} />
      <HeroCharacters />

      {!detailOpen && (
        <div className={styles.ctaPanel}>
          <HeroCTA
            content={content}
            onSelectAvatar={() => {
              onSelect(currentIndex, { open: true, userInitiated: true });
            }}
          />
        </div>
      )}

      <ScrollIndicator
        soundOn={soundOn}
        scrollText={content?.scrollText}
        onToggleSound={() => setSoundOn((v) => !v)}
      />
    </section>
  );
});
