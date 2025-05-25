import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "@/context/app-context"
import { ToastProvider } from "@/context/toast-context"
import { ToastStack } from "@/components/ui/toast-stack"
import { MarketProvider } from "@/context/market-context"
import { Toaster } from "@/components/ui/toaster"
import ConnectionStatus from "@/components/ConnectionStatus"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NAPS - Navigate and Plan Smartly",
  description: "AI-Driven Financial Literacy and Fraud Detection",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <AppProvider>
              <MarketProvider>
                {children}
                <ToastStack />
                <Toaster />
                <ConnectionStatus />
              </MarketProvider>
            </AppProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

