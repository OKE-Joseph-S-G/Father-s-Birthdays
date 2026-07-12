import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Joyeux Anniversaire Papa !',
  description: 'Site d\'anniversaire pour mon père',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
