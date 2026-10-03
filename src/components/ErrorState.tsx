"use client";

import * as React from "react";
import * as stylex from "@stylexjs/stylex";
import { Button } from "@/components/ui/button";

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBlock: "3rem",
    rowGap: "1rem",
  },
  message: {
    color: "oklch(63.7% 0.237 25.331)",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
  },
  hint: {
    maxWidth: "20rem",
    textAlign: "center",
    fontSize: "0.75rem",
    lineHeight: 1.625,
    color: "var(--muted-foreground)",
  },
});

export function ErrorState({
  message,
  hint = "Try again to reload this page.",
  onRetry,
}: {
  message: string;
  hint?: string;
  onRetry?: () => void;
}) {
  const handleRetry = React.useCallback(() => {
    if (onRetry) {
      onRetry();
      return;
    }
    window.location.reload();
  }, [onRetry]);

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.message)}>{message}</div>
      {hint ? <p {...stylex.props(styles.hint)}>{hint}</p> : null}
      <Button variant="outline" onClick={handleRetry}>
        Try again
      </Button>
    </div>
  );
}
