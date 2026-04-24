import styles from "./index.module.css";

export function LoadingDots() {
  return (
    <span className={styles.wrapper} aria-label="Loading">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  );
}
