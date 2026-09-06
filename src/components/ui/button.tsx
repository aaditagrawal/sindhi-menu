import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";

const variants = {
  default: styles.buttonVariant_default,
  destructive: styles.buttonVariant_destructive,
  outline: styles.buttonVariant_outline,
  secondary: styles.buttonVariant_secondary,
  ghost: styles.buttonVariant_ghost,
  link: styles.buttonVariant_link,
};
const sizes = {
  default: styles.buttonSize_default,
  sm: styles.buttonSize_sm,
  lg: styles.buttonSize_lg,
  icon: styles.buttonSize_icon,
};
type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

/** Compose button appearance and size classes while retaining the public helper. */
export function buttonVariants({
  variant = "default",
  size = "default",
  className,
  class: extraClass,
}: {
  variant?: Variant | null;
  size?: Size | null;
  className?: string;
  class?: string;
} = {}) {
  return [
    stylex.props(styles.buttonBase, variant && variants[variant], size && sizes[size]).className,
    className,
    extraClass,
  ]
    .filter(Boolean)
    .join(" ");
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant | null;
  size?: Size | null;
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={buttonVariants({ variant, size, className })} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
export { Button };
