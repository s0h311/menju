'use client'

import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className='grid place-items-center w-full bg-light'>
      <p className='text-dark2' onClick={() => setCount(count + 1)}>
        {count}
      </p>
    </div>
  )
}
