import type { SidebarMenu } from '@/types/dashboard.type'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type SidebarProps = {
  menus: SidebarMenu[]
}

export default function Sidebar({ menus }: SidebarProps) {
  const [showSidebar, setShowSidebar] = useState<boolean>(true)
  const path = usePathname()
  const supabase = createClientComponentClient()
  const router = useRouter()
  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      {!showSidebar && (
        <button
          className='absolute top-5 left-0 bg-accent px-1.5 py-5 rounded-r-md'
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {'>>'}
        </button>
      )}
      {showSidebar && (
        <aside className='bg-secondary p-5 lg:p-10 w-fit h-full relative'>
          <button
            className='absolute top-5 right-0 bg-accent px-1.5 py-4 rounded-l-md'
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {'<<'}
          </button>
          <ul className='space-y-4 list-none'>
            {menus.map((menu) => (
              <li key={menu.id}>
                <Link
                  className={`${path === menu.path ? 'underline' : ''} whitespace-nowrap`}
                  href={menu.path}
                >
                  {menu.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            className='absolute bottom-5 lg:bottom-7'
            onClick={signOut}
          >
            Ausloggen
          </button>
        </aside>
      )}
    </>
  )
}
