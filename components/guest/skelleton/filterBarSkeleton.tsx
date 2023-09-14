import React from 'react'
import { Skeleton } from '@mui/material'

export default function FilterBarSkeleton() {
  return (
    <Skeleton
      className='rounded sticky top-2 border-2'
      sx={{ height: 75 }}
    ></Skeleton>
  )
}
