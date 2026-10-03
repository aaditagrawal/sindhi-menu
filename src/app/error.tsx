"use client";

import * as React from "react";
import * as stylex from "@stylexjs/stylex";

import { ErrorState } from "@/components/ErrorState";

const styles = stylex.create({
  page: {
    paddingInline: {
      default: "1rem",
      "@media (min-width: 640px)": "1.5rem",
      "@media (min-width: 768px)": "2rem",
    },
    paddingBlock: "2rem",
  },
  inner: {
    marginInline: "auto",
    maxWidth: "56rem",
  },
});

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error.digest ? `Route error (digest: ${error.digest})` : "Route error", error);
  }, [error]);

  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.inner)}>
        <ErrorState message="The Sindhi menu hit a problem" onRetry={reset} />
      </div>
    </div>
  );
}
