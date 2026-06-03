import type { Metadata, Viewport } from "next";
import localFont from "next/font/local"; // ✅ Replaced next/font/google with local font loader

import { AuthHydration } from "@/components/providers/auth-hydration";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { siteConfig } from "@/config/site";

import "./globals.css";

// ✅ 1. Load Local Manrope Variable Font
const manrope = localFont({
  src: "../../public/fonts/Manrope-VariableFont_wght.ttf", // Adjust relative directory path if your layout file is structured differently
  variable: "--font-manrope",
  display: "swap",
  weight: "100 800", // Automatically supports thin (100) all the way to extra bold (800) from your single variable file
});

// ✅ 2. Load Local Open Sans Variable Font
const openSans = localFont({
  src: "../../public/fonts/OpenSans-VariableFont_wdth,wght.ttf",
  variable: "--font-open-sans",
  display: "swap",
  weight: "300 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#274376" },
    { media: "(prefers-color-scheme: dark)", color: "#282E3C" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // Keeps the tailwind font utility mappings active
      className={`${manrope.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <QueryProvider>
          <ThemeProvider>
            <AuthHydration>{children}</AuthHydration>
            <ToastProvider />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}