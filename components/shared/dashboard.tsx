'use client'

import type { ReactNode } from 'react'
import Sidebar from './sidebar'
import type { SidebarMenu } from '@/types/dashboard.type'

type DashboardProps = {
  sidebarMenus: SidebarMenu[]
  children: ReactNode
}

export default function Dashboard({ sidebarMenus, children }: DashboardProps) {
  return (
    <main className='grid place-items-center h-screen w-screen'>
      <section className='flex w-full h-full'>
        <Sidebar menus={sidebarMenus} />
        <div className='space-y-3 w-full h-full rounded-lg p-5 xl:p-10 '>{children}</div>
      </section>
    </main>
  )
}
