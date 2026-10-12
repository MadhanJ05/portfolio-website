// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Madhan Jothimani - Quant & Machine Learning',
  description: 'Data scientist working across quantitative finance and machine learning: derivatives pricing, overfitting-aware backtesting, and ML early-warning systems for trading platforms',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}