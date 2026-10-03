import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import * as stylex from "@stylexjs/stylex";
import { AppChrome } from "@/components/AppChrome";
import { easing } from "@/lib/tokens.stylex";
import { sxc } from "@/lib/utils";
import { geistSans, geistMono } from "./fonts";
import Script from "next/script";
import "./globals.css";

const styles = stylex.create({
  body: {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
  },
  footer: {
    paddingBlock: {
      default: "1.5rem",
      "@media (min-width: 1024px)": "2.5rem",
    },
    paddingInline: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  footerPill: {
    display: "inline-flex",
    paddingInline: {
      default: "1.25rem",
      "@media (min-width: 640px)": "1.5rem",
    },
    paddingBlock: "0.75rem",
    borderRadius: {
      default: "1.25rem",
      "@media (min-width: 1024px)": "9999px",
    },
    backgroundColor: "color-mix(in oklab, var(--secondary) 40%, transparent)",
    borderWidth: "1px",
    maxWidth: "min(100%, 52rem)",
  },
  footerText: {
    fontSize: {
      default: "0.75rem",
      "@media (min-width: 1024px)": "0.8125rem",
    },
    lineHeight: 1.6,
    color: "var(--muted-foreground)",
    textAlign: "center",
  },
  footerLink: {
    color: {
      default: null,
      ":hover": "var(--foreground)",
    },
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
    transitionDuration: "150ms",
    transitionTimingFunction: easing.twDefault,
  },
});

export const metadata: Metadata = {
  title: {
    default: "Sindhi Menu",
    template: "%s — Sindhi Menu",
  },
  description:
    "A fast, friendly viewer for Sindhi Mess weekly menu with time-aware highlighting (IST).",
};

/** Provide the existing theme, notification, and shared page shell. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body {...sxc(`${geistSans.variable} ${geistMono.variable} scroll-optimized`, styles.body)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main {...stylex.props(styles.main)}>{children}</main>
          <footer {...stylex.props(styles.footer)}>
            <div {...stylex.props(styles.footerPill)}>
              <p {...stylex.props(styles.footerText)}>
                Made by{" "}
                <a
                  href="https://aadit.cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...stylex.props(styles.footerLink)}
                >
                  Aadit (aadit.cc)
                </a>
                {" • "}
                Data as put on the Sindhi Mess banner.
                {" • "}
                This project is{" "}
                <a
                  href="https://github.com/aaditagrawal/sindhi-menu"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...stylex.props(styles.footerLink)}
                >
                  open source on GitHub
                </a>
                {" • "}
                <a
                  href="/openapi.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...stylex.props(styles.footerLink)}
                >
                  API docs (OpenAPI JSON)
                </a>
              </p>
            </div>
          </footer>
          <AppChrome />
        </ThemeProvider>
        <Script defer src="https://stat.sys256.com/script.js" />
      </body>
    </html>
  );
}
