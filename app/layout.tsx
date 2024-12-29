import "./globals.css";

import { Inter } from "next/font/google";
import { themeEffect } from "./theme-effect";
import { Analytics } from "./analytics";
import { Header } from "./header";
import { Footer } from "./footer";
import { doge } from "./doge";

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
  },
  twitter: {
    card: "summary_large_image",
    site: "@eckartal",
    creator: "@eckartal",
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
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#000000" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();(${doge.toString()})();`,
          }}
        />
      </head>

      <body className="dark:text-gray-100 max-w-2xl m-auto">
        <main className="p-6 pt-3 md:pt-6 min-h-screen">
          <Header />
          {children}
        </main>

        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
