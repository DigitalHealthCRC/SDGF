import type React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";

import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ProgressProvider } from "@/lib/progress-context";
import {
  Inter,
  Geist as V0_Font_Geist,
  Geist_Mono as V0_Font_Geist_Mono,
  Source_Serif_4 as V0_Font_Source_Serif_4,
} from "next/font/google";

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });
const _geistMono = V0_Font_Geist_Mono({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] });

const inter = Inter({ subsets: ["latin"] });

const ENV = process.env as Record<string, string | undefined>;
const BASE_PATH = ENV.NEXT_PUBLIC_BASE_PATH ?? ENV.__NEXT_ROUTER_BASEPATH ?? "";
const assetPath = (path: string) => `${BASE_PATH}${path}`;

export const metadata: Metadata = {
  title: "SynD - Synthetic Health Data Governance Framework",
  description: "A comprehensive framework for safely generating and using synthetic health data in Australia",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={assetPath("/print.css")} media="print" />
        <link rel="icon" href={assetPath("/favicon.png")} sizes="192x192" />
        <link rel="apple-touch-icon" href={assetPath("/favicon.png")} />
      </head>
      <body className={inter.className}>
        <ProgressProvider>
          <Suspense fallback={null}>
            <Navigation />
            <main className="min-h-screen">{children}</main>
          </Suspense>
        </ProgressProvider>
        <link rel="stylesheet" href={assetPath("/assets/chatbot/chatbot-theme.css")} />
        <script src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js" async />
        <script src={assetPath("/assets/chatbot/chatkit.js")} defer />
      </body>
    </html>
  );
}
