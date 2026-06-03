"use client";

import type { HomeContent } from "lib/shopify/types";
import React, { type CSSProperties } from "react";
import HeroImageSequence from "../HeroImageSequence";
import styles from "./index.module.css";

type Props = {
  content?: HomeContent;
};

const defaultHeroTitle = ["You always", "find your way", "back"];
const defaultHeroSubtitle = [
  "Explore streetwear with sharp silhouettes, focused drops,",
  "and pieces built to move from city nights to daily rituals.",
];

const splitContentLines = (value: string | undefined, fallback: string[]) => {
  if (!value) return fallback;
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : fallback;
};

// Removed HeroBackground component since it is replaced by HeroImageSequence

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
    </section>
  );
}

function HeroCharacters() {
  return <div className={styles.heroCharacters} aria-hidden />;
}

function ScrollIndicator({ scrollText }: { scrollText?: string }) {
  return (
    <div className={styles.landingFooter} data-no-swipe>
      <div className={styles.scrollCue} aria-hidden="true">
        <span className={styles.mouseCue}>
          <span />
        </span>
        <span>{scrollText ?? "Scroll to enter"}</span>
      </div>
    </div>
  );
}

export const ScrollStage = React.memo(function ScrollStage({ content }: Props) {
  const stageStyle = content?.heroImage?.url
    ? ({
        "--hero-image": `url("${content.heroImage.url}")`,
      } as CSSProperties)
    : undefined;

  return (
    <HeroImageSequence
      frameCount={192}
      framePath="/hero-sequence/ezgif-frame-"
      frameExtension="webp"
      fallbackImage="/hero-sequence/ezgif-frame-001.webp"
      mobileFrameCount={192}
      mobileFramePath="/hero-sequence-mobile/ezgif-frame-"
      mobileFrameExtension="webp"
      mobileFallbackImage="/hero-sequence-mobile/ezgif-frame-001.webp"
    >
      <section
        className={styles.stage}
        style={{ ...stageStyle, background: "transparent", height: "100%" }}
        aria-label="BLCKOLE entry campaign"
      >
        <div className={styles.leftPanel}>
          <HeroCopy content={content} />
        </div>

        <HeroCharacters />

        {/* <ScrollIndicator scrollText={content?.scrollText} /> */}
      </section>
    </HeroImageSequence>
  );
});
