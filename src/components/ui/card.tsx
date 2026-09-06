import * as React from "react";
import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";

type StyledProps<T> = React.HTMLAttributes<T> & {
  xstyle?: stylex.StyleXStyles<Record<string, string | number | null>>;
};
export type CardProps = StyledProps<HTMLDivElement>;

/** Apply card defaults and an optional atomic style override to the root. */
export function Card({ className, xstyle, ...props }: CardProps) {
  return (
    <div
      className={[stylex.props(styles.Card, xstyle).className, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

/** Preserve header padding and spacing between its direct children. */
export function CardHeader({ className, xstyle, ...props }: StyledProps<HTMLDivElement>) {
  return (
    <div
      className={[stylex.props(styles.CardHeader, xstyle).className, className]
        .filter(Boolean)
        .join(" ")}
      data-stack="1.5"
      {...props}
    />
  );
}

/** Apply the card heading defaults before caller style overrides. */
export function CardTitle({ className, xstyle, ...props }: StyledProps<HTMLHeadingElement>) {
  return (
    <h3
      className={[stylex.props(styles.CardTitle, xstyle).className, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

/** Apply muted description styling while forwarding paragraph attributes. */
export function CardDescription({
  className,
  xstyle,
  ...props
}: StyledProps<HTMLParagraphElement>) {
  return (
    <p
      className={[stylex.props(styles.CardDescription, xstyle).className, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

/** Preserve the content inset and forward root attributes. */
export function CardContent({ className, xstyle, ...props }: StyledProps<HTMLDivElement>) {
  return (
    <div
      className={[stylex.props(styles.CardContent, xstyle).className, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

/** Align footer content with the card’s existing content inset. */
export function CardFooter({ className, xstyle, ...props }: StyledProps<HTMLDivElement>) {
  return (
    <div
      className={[stylex.props(styles.CardFooter, xstyle).className, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
