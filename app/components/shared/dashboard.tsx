'use client'

import { ReactNode } from 'react'
import Sidebar from './sidebar'
import { SidebarMenu } from '@/app/types/dashboard.type'
import { usePathname } from 'next/navigation'

type DashboardProps = {
  sidebarMenus: SidebarMenu[]
  children: ReactNode
}

export default function Dashboard({ sidebarMenus, children }: DashboardProps) {
  const path = usePathname()
  const title = sidebarMenus.find((menu) => menu.path === path)?.title

  return (
    <main className='grid place-items-center h-screen w-screen p-10'>
      <section className='flex gap-10 w-full h-full'>
        <Sidebar menus={sidebarMenus} />
        <div className='space-y-2 w-full h-full rounded-lg'>
          <h1 className='text-lg'>{title}</h1>
          <hr className='border-[0.5px] border-gray-300' />
          {children}
        </div>
      </section>
    </main>
  )
}
