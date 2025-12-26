import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '../components/Sidebar'

export const metadata: Metadata = {
  title: 'GeekyGoose Compliance',
  description: 'Compliance automation platform for SMB + internal IT teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto lg:ml-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}