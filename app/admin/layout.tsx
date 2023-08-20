import type { Metadata } from 'next'
import Dashboard from '../components/shared/dashboard'
import { SidebarMenu } from '../types/dashboard.type'

export const metadata: Metadata = {
  title: 'Admin Dashboard | FMSinn',
}

type AdminDashboardLayoutProps = {
  children: React.ReactNode
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const dashboardMenus: SidebarMenu[] = [
    {
      id: 1,
      label: 'Start',
      path: '/admin',
      title: 'Willkommen',
    },
    {
      id: 2,
      label: 'Add new restaurant',
      path: '/admin/addRestaurant',
      title: 'Restaurants verwalten',
    },
  ]

  return <Dashboard sidebarMenus={dashboardMenus}>{children}</Dashboard>
}
