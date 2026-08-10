import { Footer } from "components/footer";
import { Manifesto } from "components/manifesto";
import { getFooterContent } from "lib/shopify";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { StoryReveal } from "./story-reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "BLCKOLE was never created to fit in. It was created for the ones who never did.",
  openGraph: { type: "article" },
};

const STORY_PARAGRAPHS = [
  <>
    <span className={styles.highlight}>BLCKOLE</span> was never created to fit
    in. It was created for the ones who never did.
  </>,
  <>
    In a world obsessed with perfection, we found beauty in the{" "}
    <span className={styles.highlight}>unfinished</span>, the imperfect, and the
    untold. BLCKOLE is built on the belief that every scar, every setback, every
    detour, and every blank space carries a story worth wearing.
  </>,
  <>
    The name represents more than a brand. It represents the{" "}
    <span className={styles.highlight}>unknown spaces</span> we all carry within
    us—the dreams we haven’t chased yet, the risks we’re afraid to take, the
    versions of ourselves waiting to be discovered. What some see as emptiness,
    we see as <span className={styles.highlight}>possibility</span>.
  </>,
  <>
    Every piece we create is designed for the bold, the curious, the creators,
    the outsiders, and the rule-breakers. We don’t follow trends. We build{" "}
    <span className={styles.highlight}>expressions</span>. Through oversized
    silhouettes, experimental details, and unapologetic designs, we create
    clothing that feels like confidence you can wear.
  </>,
  <>
    BLCKOLE is a reminder that you don’t have to have everything figured out.{" "}
    <span className={styles.highlight}>Growth</span> happens in the gaps. Art is
    born from uncertainty. Greatness begins where comfort ends.
  </>,
  <>We are not here to tell you who to be.</>,
  <>
    We are here to remind you that{" "}
    <span className={styles.highlight}>becoming</span> is the most powerful part
    of the journey.
  </>,
  <>Welcome to BLCKOLE.</>,
  <>
    Wear your story.{" "}
    <span className={styles.highlight}>Create your own universe.</span>
  </>,
];

export default async function StoryPage() {
  const footerContent = await getFooterContent().catch(() => undefined);
  const [introParagraph, ...bodyParagraphs] = STORY_PARAGRAPHS;

  return (
    <>
      <StoryReveal manifesto={<Manifesto />}>
        <main className={styles.page}>
          <section
            className={styles.storySection}
            aria-labelledby="story-title"
          >
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <h1 id="story-title" className={styles.headline}>
                  Our Story
                </h1>
                <p className={styles.intro}>{introParagraph}</p>
              </div>
            </div>

            <div className={styles.storyBody}>
              {bodyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`${styles.storyParagraph} ${
                    index >= bodyParagraphs.length - 2 ? styles.closingLine : ""
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </main>
      </StoryReveal>
      <Footer content={footerContent} />
    </>
  );
}
