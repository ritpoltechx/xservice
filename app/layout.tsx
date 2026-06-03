import type { Metadata } from "next"
import { Inter_Tight, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "xService · ITSM & ITAM",
  description: "Onyx & Gold — quiet luxury for service ops",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("dark", interTight.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
