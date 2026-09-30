import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Okechukwu Ikwunze — Applied AI/ML Engineer",
  description:
    "Applied AI/ML Engineer building intelligent, scalable systems across models, cloud, and enterprise infrastructure.",
  keywords: [
    "AI Engineer",
    "Machine Learning Engineer",
    "Applied AI",
    "Cloud Engineer",
    "Generative AI",
    "Okechukwu Ikwunze",
  ],
  openGraph: {
    title: "Okechukwu Ikwunze — Applied AI/ML Engineer",
    description:
      "Engineering intelligence at scale. From cloud foundations to production AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
