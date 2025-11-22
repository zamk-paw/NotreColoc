import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { PWAProvider } from "@/components/providers/pwa-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    template: "%s | NotreColoc",
    default: "NotreColoc",
  },
  description:
    "NotreColoc aide les colocations à rester organisées : réservations, dépenses, invitations et plus encore dans un tableau de bord moderne.",
  applicationName: "NotreColoc",
  generator: "Next.js",
  other: {
    "theme-color": "#10b981",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn(geistSans.variable, geistMono.variable, "min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider delayDuration={150}>
              <PWAProvider />
              {children}
              <Toaster richColors closeButton position="top-center" />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
