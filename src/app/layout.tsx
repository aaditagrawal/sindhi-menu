import * as stylex from "@stylexjs/stylex";
import { styles, themeMarker } from "@/styles/site.stylex";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { MenuNotification } from "@/components/MenuNotification";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sindhi Menu",
    template: "%s — Sindhi Menu",
  },
  description:
    "A fast, friendly viewer for Sindhi Mess weekly menu with time-aware highlighting (IST).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning {...stylex.props(themeMarker)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${stylex.props(styles.body).className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div {...stylex.props(styles.themeControl)}>
            <ThemeSwitcher />
          </div>
          <MenuNotification />
          <main {...stylex.props(styles.main)}>{children}</main>
          <footer {...stylex.props(styles.footer)}>
            <div {...stylex.props(styles.footerContent)} data-stack="2">
              <p {...stylex.props(styles.footerText)}>
                Made by{" "}
                <a
                  href="https://aadit.cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...stylex.props(styles.authorLink)}
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
                  {...stylex.props(styles.sourceLink)}
                >
                  open source on GitHub
                </a>
                {" • "}
                <a
                  href="/openapi.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...stylex.props(styles.apiLink)}
                >
                  API docs (OpenAPI JSON)
                </a>
              </p>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
        <Script defer src="https://stat.sys256.com/script.js" />
      </body>
    </html>
  );
}
