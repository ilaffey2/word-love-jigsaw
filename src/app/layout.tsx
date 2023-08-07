import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

const title = "Love Jigsaw";
const description = "Discover love's magic with text embeddings!";

export const metadata: Metadata = {
  title,
  description,
  icons: [
    {
      rel: "icon",
      url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>",
    },
  ],
  twitter: {
    title,
    description,
    site: "@ilaffey2",
    card: "summary_large_image",
    images: [
      {
        url: "https://love-jigsaw.vercel.app/screenshot.png",
        alt: "Love Jigsaw",
      },
    ],
  },
  openGraph: {
    title,
    description,
    images: [
      {
        url: "https://love-jigsaw.vercel.app/screenshot.png",
        alt: "Love Jigsaw",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
