import clsx from "clsx";
import Link from "next/link";
import styles from "./index.module.css";

type ColorOption = {
  title: string;
  handle: string;
  active?: boolean;
};

type Props = {
  colors: ColorOption[];
};

export function ProductColors({ colors }: Props) {
  if (!colors.length) return null;

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Color</span>
      <div className={styles.list}>
        {colors.map((color) => (
          <Link
            key={color.handle}
            href={`/products/${color.handle}`}
            className={clsx(styles.option, color.active && styles.active)}
            aria-current={color.active ? "page" : undefined}
          >
            {color.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
