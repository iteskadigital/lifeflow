import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.daviderossi.it";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Davide Rossi | Digital Strategist & Web Developer", template: "%s | Davide Rossi" },
  description: "Freelance esperto in digital advertising, landing page, sviluppo web, vibe coding, analytics e strategie di marketing.",
  keywords: ["digital strategist", "freelance marketing", "sviluppo landing page", "web developer", "vibe coding", "web analytics", "consulente marketing"],
  authors: [{ name: "Davide Rossi" }],
  creator: "Davide Rossi",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    type: "website", locale: "it_IT", url: siteUrl,
    title: "Davide Rossi | Digital Strategist & Web Developer",
    description: "Strategia, design e tecnologia per far crescere idee ambiziose.",
    siteName: "Davide Rossi",
  },
  twitter: { card: "summary_large_image", title: "Davide Rossi | Digital Strategist", description: "Strategia, design e tecnologia per far crescere idee ambiziose." },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f4ff48" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
