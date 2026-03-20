import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taboo-Free Gifting | 跨文化礼赠",
  description:
    "AI-powered cross-cultural gift recommendation platform. Avoid cultural taboos with semantic analysis.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
