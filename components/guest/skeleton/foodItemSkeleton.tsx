import { Card, CardContent, Divider, Skeleton, Stack } from '@mui/material'
import React from 'react'

export default function FoodItemSkeleton() {
  return (
    <Card sx={{ minWidth: 250 }}>
      <Skeleton
        sx={{ height: 150 }}
        animation='wave'
        variant='rectangular'
      />
      <CardContent>
        <div className='grid grid-flow-col'>
          <Skeleton
            animation='wave'
            height={12}
            width='80%'
          />
        </div>

        <Stack
          mt={2}
          direction='row'
          justifyContent='center'
          alignItems='center'
          divider={
            <Divider
              orientation='vertical'
              flexItem
            />
          }
          spacing={2}
        >
          <ul className='list-none'>
            <Skeleton
              animation='wave'
              height={10}
              width={55}
            />
            <Skeleton
              animation='wave'
              height={10}
              width={55}
            />
            <Skeleton
              animation='wave'
              height={10}
              width={55}
            />
          </ul>
          <ul className='list-none'>
            <Skeleton
              animation='wave'
              height={10}
              width={75}
            />
            <Skeleton
              animation='wave'
              height={10}
              width={75}
            />
          </ul>
        </Stack>
      </CardContent>
    </Card>
  )
}
