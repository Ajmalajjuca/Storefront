import clsx from "clsx";
import styles from "./index.module.css";

type ButtonVariant = "default" | "primary" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  full?: boolean;
};

export function Button({
  variant = "default",
  full = false,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        styles.wrapper,
        variant === "primary" && styles.primary,
        variant === "ghost" && styles.ghost,
        full && styles.full,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
