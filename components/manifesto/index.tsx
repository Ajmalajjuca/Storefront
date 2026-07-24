import styles from "./index.module.css";

const MANIFESTO_PARAGRAPHS = [
  "BLCKOLE was built for the creators nobody sees — the artists creating in silence. The skaters, musicians, designers, dancers, and dreamers who keep going even when nobody is watching.",
  "We believe talent shouldn’t be measured by followers, fame, or popularity. Our mission is to discover, support, and amplify underground artists who deserve to be seen.",
  "More than a fashion brand, BLCKOLE is a community for the overlooked, the misunderstood, and the unapologetically different.",
  "This is not just clothing. This is a movement for the unseen.",
];

const OUTRO = "Welcome to BLCKOLE.";

export function Manifesto() {
  return (
    <section className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.label}>
          <span className={styles.labelLine} />
          <span className={styles.labelText}>Manifesto</span>
          <span className={styles.labelLine} />
        </div>

        <h2 className={styles.headline}>
          For the <span className={styles.headlineAccent}>unseen.</span>
        </h2>

        <div className={styles.body}>
          {MANIFESTO_PARAGRAPHS.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <p className={styles.outro}>{OUTRO}</p>
        <p className={styles.meta}>Established 2026</p>
      </div>
    </section>
  );
}
