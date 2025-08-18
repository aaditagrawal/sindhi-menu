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
  title: "Food Court Menu — The Indian Kitchen",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="px-4 py-4 text-xs text-muted-foreground">
          <div className="mx-auto max-w-4xl">
            Contribute at
            {" "}
            <a
              href="https://github.com/aaditagrawal/fc-menu"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              github.com/aaditagrawal/fc-menu
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
