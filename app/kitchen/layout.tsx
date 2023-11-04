import type { Metadata } from 'next'
import Dashboard from '@/components/shared/dashboard'
import type { SidebarMenu } from '@/types/dashboard.type'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Kitchen Dashboard | Menju',
}

type KitchenDashboardLayoutProps = {
  children: ReactNode
}

export default function AdminDashboardLayout({ children }: KitchenDashboardLayoutProps) {
  const dashboardMenus: SidebarMenu[] = [
    {
      id: 1,
      label: 'Bestellungen',
      path: '/kitchen',
    },
    {
      id: 2,
      label: 'Kategorien & Gerichte',
      path: '/kitchen/dishes',
    },
    {
      id: 3,
      label: 'Einstellungen',
      path: '/kitchen/settings',
    },
    {
      id: 4,
      label: 'Tools',
      path: '/kitchen/tools',
    },
  ]

  return <Dashboard sidebarMenus={dashboardMenus}>{children}</Dashboard>
}
