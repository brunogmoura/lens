import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lens — Inteligência de Mercado',
  description: 'Digest de mercado com inteligência coletiva de equipe',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
