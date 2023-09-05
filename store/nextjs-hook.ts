import { useState, useEffect } from 'react'
import { shallow } from 'zustand/shallow'

const useStore = <T, F>(
  store: (callback: (state: T) => unknown, shallow?: <T>(objA: T, objB: T) => boolean) => unknown,
  callback: (state: T) => F,
  isShallow?: boolean
) => {
  const result = isShallow ? (store(callback, shallow) as F) : (store(callback) as F)
  const [data, setData] = useState<F>()

  useEffect(() => {
    setData(result)
  }, [result])

  return data
}

export default useStore
