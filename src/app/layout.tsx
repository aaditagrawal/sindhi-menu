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
          <div className="mx-auto max-w-4xl px-4 py-3 space-y-2">
            <p className="text-sm text-foreground text-center">
              Thanks to The Indian Kitchen, Manipal for providing data for this project. Use the{" "}
              <a
                href="https://tikm.coolstuff.work/docs/reference"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                API docs
              </a>{" "}
              to integrate this data in your own app.
            </p>
            <p className="text-sm text-foreground text-center">
              This project is{" "}
              <a
                href="https://github.com/aaditagrawal/fc-menu"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                open source on GitHub
              </a>
              . Contributions are welcome!
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
