import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "Food Court 2 Menu — The Indian Kitchen",
    template: "%s — The Indian Kitchen",
  },
  description: "A fast, friendly viewer for weekly menus with time-aware highlighting (IST).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://stat.sys256.com/script.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        

        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t bg-secondary/40">
          <div className="mx-auto max-w-4xl px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-foreground">
                This site is crowdsourced — add weekly menus to help everyone.
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/aaditagrawal/fc-menu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-sm"
                >
                  Contribute on GitHub
                </a>
                <a href="/contributing" className="underline text-sm">Guide</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
