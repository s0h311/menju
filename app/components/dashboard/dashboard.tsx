import { ReactNode } from 'react'
import Sidebar from './sidebar'
import { SidebarMenu } from '@/app/types/dashboard.type'

type DashboardProps = {
  sidebarMenus: SidebarMenu[]
  children: ReactNode
}

export default function Dashboard({ sidebarMenus, children }: DashboardProps) {
  return (
    <main className='grid place-items-center h-screen w-screen p-10'>
      <section className='grid grid-cols-[1fr_3fr] xl:grid-cols-[1fr_4fr] gap-5 w-full h-full'>
        <Sidebar menus={sidebarMenus} />
        <div className='w-full h-full bg-gray-100 rounded-lg p-5'>{children}</div>
      </section>
    </main>
  )
}
