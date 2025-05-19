import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "@/context/app-context"
import { ToastProvider } from "@/context/toast-context"
import { ToastStack } from "@/components/ui/toast-stack"

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
              {children}
              <ToastStack />
            </AppProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

