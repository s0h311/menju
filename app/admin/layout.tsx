import type { Metadata } from 'next'
import Dashboard from '../components/dashboard/dashboard'
import { SidebarMenu } from '../types/dashboard.type'

export const metadata: Metadata = {
  title: 'Dashboard | FMSinn',
}

type AdminDashboardLayoutProps = {
  children: React.ReactNode
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const dashboardMenus: SidebarMenu[] = [
    {
      id: 1,
      label: 'Start',
      path: '/admin/dashboard',
    },
    {
      id: 2,
      label: 'Add new restaurant',
      path: '/admin/addRestaurant',
    },
  ]

  return <Dashboard sidebarMenus={dashboardMenus}>{children}</Dashboard>
}
