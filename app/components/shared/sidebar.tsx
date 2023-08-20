import { SidebarMenu } from '@/app/types/dashboard.type'
import Link from 'next/link'
import { useState } from 'react'

type SidebarProps = {
  menus: SidebarMenu[]
}

export default function Sidebar({ menus }: SidebarProps) {
  const [showSidebar, setShowSidebar] = useState<boolean>(true)

  return (
    <>
      {!showSidebar ? (
        <button
          className='absolute top-10 left-0 bg-slate-400 px-1.5 py-5 rounded-r-md text-white'
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {'>>'}
        </button>
      ) : (
        ''
      )}
      {showSidebar ? (
        <aside className='bg-gray-300 rounded-lg p-5 w-1/3 xl:w-1/4 h-full relative'>
          <button
            className='absolute top-0 right-0 bg-slate-400 px-1.5 py-5 rounded-l-md text-white'
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {'<<'}
          </button>
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
      ) : (
        ''
      )}
    </>
  )
}
