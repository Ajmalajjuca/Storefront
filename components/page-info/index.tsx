import styles from "./index.module.css";

type Props = {
  title: string;
  count?: number;
};

export function PageInfo({ title, count }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div className={styles.inner}>
          <span className={styles.title}>{title}</span>
          {count !== undefined && (
            <span className={styles.count}>{count} Products</span>
          )}
        </div>
      </div>
    </div>
  );
}
