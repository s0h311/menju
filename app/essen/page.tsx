'use client'

import { trpc } from '@/trpc/trpc'
import { useState } from 'react'

export interface EssenData {
  id?: number
  name: string
  preis: number
}

export default function Essen() {
  const [essenData, setEssenData] = useState<EssenData>({
    name: '',
    preis: 0,
  })

  //const [essenList, setEssenList] = useState<EssenData[]>([])

  const saveEssen = async () => {
    await fetch(`/api/essen?name=${essenData.name}&preis=${essenData.preis}`, {
      method: 'POST',
    })

    setEssenData({ name: '', preis: 0 })
  }

  // WITH TRPC
  const essenList = trpc.userById.useQuery(1).data || []

  // CODE BELOW WITH FETCH

  // const getEssen = async () => {
  //   const data = await fetch('/api/essen', {
  //     method: 'GET',
  //   })
  //   const json = await data.json()
  //   setEssenList(json)
  // }

  // useEffect(() => {
  //   getEssen().catch(console.error)
  // }, [])

  return (
    <div className='grid place-items-center gap-5'>
      <input
        type='text'
        placeholder='name'
        value={essenData.name}
        onChange={(event) => {
          setEssenData({
            ...essenData,
            name: event.target.value,
          })
        }}
      />

      <input
        type='text'
        placeholder='price'
        value={essenData.preis}
        onChange={(event) => {
          setEssenData({
            ...essenData,
            preis: parseInt(event.target.value),
          })
        }}
      />

      <button onClick={() => saveEssen()}>save</button>
      {essenList.map((essen) => (
        <div className='p-4 rounded-xl bg-red-500' key={essen.id}>
          <p>{essen.name}</p>
        </div>
      ))}
    </div>
  )
}
