"use client";

import type { HomeContent } from "lib/shopify/types";
import React from "react";
import HeroImageSequence from "../HeroImageSequence";
import styles from "./index.module.css";

type Props = {
  content?: HomeContent;
};

const defaultHeroTitle = ["You always", "find your way", "back"];
const defaultHeroSubtitle = [""];

const splitContentLines = (value: string | undefined, fallback: string[]) => {
  if (!value) return fallback;
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : fallback;
};

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

export const ScrollStage = React.memo(function ScrollStage({ content }: Props) {
  return (
    <HeroImageSequence>
      <section
        className={styles.stage}
        style={{ background: "transparent", height: "100%" }}
        aria-label="BLCKOLE entry campaign"
      >
        <div className={styles.leftPanel}>
          <HeroCopy content={content} />
        </div>

        <HeroCharacters />
      </section>
    </HeroImageSequence>
  );
});
