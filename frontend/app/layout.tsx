import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aduppu അടുപ്പ് | Intelligent LPG Manager',
  description:
    'Aduppu (അടുപ്പ്) is a premium LPG conservation and management platform designed to optimize household and commercial gas usage efficiently.',
  keywords: 'LPG management, Aduppu, അടുപ്പ്, gas conservation, smart kitchen, efficiency',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Noto+Sans+Malayalam:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen antialiased bg-slate-950">
        {children}
      </body>
    </html>
  )
}
