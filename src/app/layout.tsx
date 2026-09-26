import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site, links } from "@/content/site";
import { SceneMount } from "@/components/scene/SceneMount";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Nav } from "@/components/ui/Nav";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ViewTransitions } from "@/components/ui/TransitionLink";
import { Intro } from "@/components/ui/Intro";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.handle}`,
    template: `%s — ${site.handle}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — ${site.handle}`,
    description: site.description,
    siteName: site.handle,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d12" },
  ],
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.handle,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: site.role,
  worksFor: { "@type": "Organization", name: site.company },
  sameAs: Object.values(links),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body className="grain">
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ViewTransitions>
            <SmoothScroll />
            <SceneMount />
            <Nav />
            <CommandPalette />
            <Intro />
            <div className="relative z-10">{children}</div>
          </ViewTransitions>
        </ThemeProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
