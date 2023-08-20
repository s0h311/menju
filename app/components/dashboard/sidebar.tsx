import { SidebarMenu } from '@/app/types/dashboard.type'
import Link from 'next/link'

type SidebarProps = {
  menus: SidebarMenu[]
}

export default function Sidebar({ menus }: SidebarProps) {
  return (
    <aside className='bg-gray-300 rounded-lg p-5 w-full h-full'>
      {menus.map((menu) => (
        <Link
          className='text-lg'
          key={menu.id}
          href={menu.path}
        >
          {menu.label}
          <br />
        </Link>
      ))}
    </aside>
  )
}
