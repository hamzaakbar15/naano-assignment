import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Headings / nav / buttons
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
// Body text
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});
// Numbers / stats / table data / uppercase labels
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "Naano — Book LinkedIn creators",
  description: "A B2B marketplace: companies book creators for sponsored LinkedIn posts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", spaceGrotesk.variable, plexSans.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <NextTopLoader color="#4a5af0" height={3} showSpinner={false} shadow={false} />
        {/* Brand strip across the very top of every page; the spacer keeps content clear of it. */}
        <div className="bg-brand-strip fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden />
        <div className="h-[3px]" aria-hidden />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
