import type { Metadata } from 'next'
import Dashboard from '@/components/shared/dashboard'
import { SidebarMenu } from '@/types/dashboard.type'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Menju',
}

type AdminDashboardLayoutProps = {
  children: ReactNode
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const dashboardMenus: SidebarMenu[] = [
    {
      id: 1,
      label: 'Start',
      path: '/admin',
    },
    {
      id: 2,
      label: 'Restaurants',
      path: '/admin/addRestaurant',
    },
    {
      id: 3,
      label: 'Benutzer',
      path: '/admin/userManagement',
    },
  ]

  return <Dashboard sidebarMenus={dashboardMenus}>{children}</Dashboard>
}
