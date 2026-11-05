import type { ComponentProps } from "react";
import Link from "next/link";
import { buttonStyles, type ButtonProps } from "@/components/ui/button";

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className" | "style"> &
  Pick<ButtonProps, "variant" | "size" | "style">;

/** Navigation shares button variants without loading routing into ordinary buttons. */
export function ButtonLink({
  variant = "default",
  size = "default",
  style,
  ...props
}: ButtonLinkProps) {
  return <Link {...buttonStyles(variant, size, style)} {...props} />;
}
