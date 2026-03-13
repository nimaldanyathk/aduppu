import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OptiFlame AI — LPG Crisis Optimizer | March 2026',
  description:
    'Emergency LPG conservation tool for the March 2026 Hormuz Strait crisis. Optimize household and commercial gas usage with AI-powered guidance.',
  keywords: 'LPG shortage, gas crisis, India 2026, Hormuz Strait, OptiFlame, LPG conservation',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
        {children}
      </body>
    </html>
  )
}
