import type React from "react"
import type { Metadata, Viewport } from "next/dist/lib/metadata/types/metadata-interface"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Icebreaker",
  description: "Gamify your events with Icebreaker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Icebreaker",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-512x512.png"></link>
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-black grid-pattern`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
