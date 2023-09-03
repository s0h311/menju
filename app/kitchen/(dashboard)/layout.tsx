import type { Metadata } from 'next'
import Dashboard from '../../components/shared/dashboard'
import { SidebarMenu } from '../../types/dashboard.type'

export const metadata: Metadata = {
  title: 'Kitchen Dashboard | Menju',
}

type KitchenDashboardLayoutProps = {
  children: React.ReactNode
}

export default function AdminDashboardLayout({ children }: KitchenDashboardLayoutProps) {
  const dashboardMenus: SidebarMenu[] = [
    {
      id: 1,
      label: 'Start',
      path: '/kitchen',
    },
    {
      id: 2,
      label: 'Kategorien & Gerichte',
      path: '/kitchen/dishes',
    },
  ]

  return <Dashboard sidebarMenus={dashboardMenus}>{children}</Dashboard>
}
