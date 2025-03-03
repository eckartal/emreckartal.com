import "./globals.css";

import { Inter } from "next/font/google";
import { themeEffect } from "./theme-effect";
import { Analytics } from "./analytics";
import { Header } from "./header";
import { Footer } from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Emre Can Kartal",
  description: "Builder, marketer, learner. I'm passionate about finding patterns in humans' relationships with software, AI, and various aspects of life.",
  openGraph: {
    title: "Emre Can Kartal",
    description: "I'm passionate about finding patterns in humans' relationships with software, AI, and various aspects of life.",
    url: "https://emreckartal.com",
    siteName: "Emre Can Kartal",
    images: ["/opengraph-image"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eckartal",
    creator: "@eckartal",
    description: "I'm passionate about finding patterns in humans' relationships with software, AI, and various aspects of life.",
  },
  alternates: {
    canonical: "https://emreckartal.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  metadataBase: new URL("https://emreckartal.com"),
};

export const viewport = {
  themeColor: "transparent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} antialiased`}
      suppressHydrationWarning={true}
    >

      <body className="dark:text-gray-100 max-w-2xl m-auto">
        <main className="p-6 pt-2 md:pt-4 min-h-screen">
          <Header />
          {children}
        </main>

        <Footer />
        <Analytics />
      </body>
    </html>
  );
}