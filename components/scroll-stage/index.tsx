"use client";

import type { HomeContent } from "lib/shopify/types";
import React, { type CSSProperties } from "react";
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
    <section
      className={styles.stage}
      style={stageStyle}
      aria-label="BLCKOLE entry campaign"
    >
      <div className={styles.leftPanel}>
        <HeroCopy content={content} />
      </div>

      <HeroBackground style={stageStyle} />
      <HeroCharacters />

      <ScrollIndicator scrollText={content?.scrollText} />
    </section>
  );
});
