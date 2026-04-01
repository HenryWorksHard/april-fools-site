import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "foolcoin",
  description: "The official foolcoin experience. Windows XP nostalgia meets April Fools.",
  icons: {
    icon: [
      { url: "/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png?v=2", sizes: "64x64", type: "image/png" },
      { url: "/favicon-128.png?v=2", sizes: "128x128", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png?v=2" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        {/* Preload video as early as possible */}
        <link rel="preload" href="/video/intro.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/images/bliss.jpg" as="image" />
      </head>
      <body className="antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
