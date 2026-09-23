import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Productainment",
  description: "One song in. A 30-day posting plan out. Post with confidence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-5">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Productainment<span className="text-gold">.</span>
          </Link>
          <Link href="/dashboard" className="btn-ghost">
            My songs
          </Link>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">{children}</main>
      </body>
    </html>
  );
}
