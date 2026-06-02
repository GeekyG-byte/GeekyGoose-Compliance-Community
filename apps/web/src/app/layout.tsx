import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import LayoutShell from '../components/LayoutShell'

export const metadata: Metadata = {
  title: 'GeekyGoose Compliance',
  description: 'Compliance automation platform for SMB + internal IT teams',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  )
}