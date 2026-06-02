'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import GlobalScanStatus from './GlobalScanStatus'

const NO_SHELL_PATHS = ['/setup', '/login']

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = NO_SHELL_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto lg:ml-0">{children}</main>
      </div>
      <GlobalScanStatus />
    </>
  )
}
