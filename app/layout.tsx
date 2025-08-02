import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "ร้านเครื่องดื่มไทย POS - ระบบขายหน้าร้าน",
  description: "ระบบ Point of Sale สำหรับร้านเครื่องดื่มไทย พร้อมรายงานยอดขายรายวัน และการจัดการสินค้า",
  keywords: "POS, Point of Sale, ร้านเครื่องดื่ม, ระบบขาย, รายงานยอดขาย, Prisma, Thai drinks",
  authors: [{ name: "Thai Drink Shop POS" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
