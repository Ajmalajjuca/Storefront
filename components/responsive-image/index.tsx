import clsx from "clsx";
import Image from "next/image";
import styles from "./index.module.css";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  contain?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
};

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  priority = false,
  contain = false,
  className,
  fill = false,
  sizes,
}: Props) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : (width ?? 800)}
        height={fill ? undefined : (height ?? 1000)}
        fill={fill}
        priority={priority}
        sizes={sizes ?? "(max-width: 900px) 100vw, 50vw"}
        className={clsx(styles.image, contain && styles.contain)}
      />
    </div>
  );
}
