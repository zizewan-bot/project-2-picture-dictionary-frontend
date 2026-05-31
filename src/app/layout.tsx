import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Picture Dictionary",
  description: "A visual English dictionary with calendar lookup history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f7f3ea] text-stone-950">
        <header className="border-b border-stone-200 bg-white/90">
          <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-xl font-bold text-stone-950">
              Picture Dictionary
            </Link>
            <div className="flex flex-wrap gap-2 text-sm font-semibold text-stone-700">
              <Link className="rounded-md px-3 py-2 hover:bg-stone-100" href="/">
                Search
              </Link>
              <Link className="rounded-md px-3 py-2 hover:bg-stone-100" href="/calendar">
                Calendar
              </Link>
              <Link className="rounded-md px-3 py-2 hover:bg-stone-100" href="/about">
                About
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
