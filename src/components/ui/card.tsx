import * as React from "react";
import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";

type StyledProps<T> = React.HTMLAttributes<T> & {
  xstyle?: stylex.StyleXStyles<Record<string, string | number | null>>;
};
export type CardProps = StyledProps<HTMLDivElement>;

export function Card({ className, xstyle, ...props }: CardProps) {
  return (
    <div
      className={[stylex.props(styles.Card, xstyle).className, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

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
