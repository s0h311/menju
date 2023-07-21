'use client'

import { trpc } from '@/trpc/trpc'
import Image from 'next/image'

export default function Home() {
  const dishesByCategory = trpc.dishesByCategory.useQuery(1)

  return (
    <div className='grid gap-5 border p-5 border-red-400'>
      {dishesByCategory.data?.map((category) => (
        <div className='grid gap-2 border p-2 border-blue-400' key={category.category.id}>
          <p>{category.category.name}</p>
          {category.dishes.map((dish) => (
            <div className='grid gap-2 p-2 border border-green-400' key={dish.id}>
              <p>{dish.name}</p>
              <Image src={dish.picture} width={500} height={300} alt='' />
              <p>{dish.price}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
