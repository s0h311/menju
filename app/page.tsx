'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <section className='grid place-items-center gap-10 mt-10'>
      <h1 className='text-2xl flex items-center gap-1'>
        <p>Welcome to</p>
        <p className='italic'>Menju</p>
      </h1>

      <Link
        className='rounded-xl border border-accent px-3 py-1 text-xl active:border-none active:bg-accent active:text-primary'
        href='/1'
      >
        Go to Demo
      </Link>
    </section>
  )
}
