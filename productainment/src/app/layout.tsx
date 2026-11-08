import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/env";
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
        <footer className="mx-auto w-full max-w-3xl border-t border-line px-4 py-8 text-sm text-muted">
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/terms" className="hover:text-cream">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-cream">
              Privacy
            </Link>
            <Link href="/refunds" className="hover:text-cream">
              Refunds and cancellations
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-cream">
              {CONTACT_EMAIL}
            </a>
          </nav>
          <p className="mt-3">
            © {new Date().getFullYear()} Productainment. Made by{" "}
            <a href="https://www.musicbizmanifesto.com/about" className="underline hover:text-cream">
              Terrance Wilburn
            </a>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
