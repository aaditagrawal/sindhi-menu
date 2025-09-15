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
  other: {
    'cache-control': 'public, max-age=604800',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-4 right-4 z-50">
            <ThemeSwitcher />
          </div>
          <MenuNotification />
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-secondary/40">
            <div className="mx-auto max-w-4xl px-4 py-3 space-y-2">
              <p className="text-sm text-foreground text-center">
                Made by{" "}
                <a
                  href="https://aadit.cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  Aadit (aadit.cc)
                </a>
                {" • "}
                Data as put on the Sindhi Mess banner.
                {" • "}
                This project is{" "}
                <a
                  href="https://github.com/aaditagrawal/sindhu-menu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  open source on GitHub
                </a>
                {" • "}
                <a
                  href="/openapi.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
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
