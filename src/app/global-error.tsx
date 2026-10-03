"use client";

import * as React from "react";
import * as stylex from "@stylexjs/stylex";

import { ErrorState } from "@/components/ErrorState";
import { sxc } from "@/lib/utils";
import { geistSans, geistMono } from "./fonts";
import "./globals.css";

const styles = stylex.create({
  body: {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingInline: "1rem",
  },
});

const THEME_INIT = {
  __html:
    'try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}',
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error.digest ? `Root error (digest: ${error.digest})` : "Root error", error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={THEME_INIT} />
      </head>
      <body {...sxc(`${geistSans.variable} ${geistMono.variable}`, styles.body)}>
        <ErrorState message="The Sindhi menu couldn't start" onRetry={reset} />
      </body>
    </html>
  );
}
