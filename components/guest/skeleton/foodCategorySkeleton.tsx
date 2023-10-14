import { Box, Divider, Skeleton, Stack } from '@mui/material'
import FoodItemSkeleton from '@/components/guest/skeleton/foodItemSkeleton'

export default function FoodCategorySkeleton() {
  return (
    <Box className='mt-4'>
      {/*  headline */}
      <Skeleton
        animation='wave'
        height={20}
        width={200}
        style={{ marginBottom: 6 }}
      />
      <Divider
        orientation='horizontal'
        flexItem
        className='mb-2'
      />
      <Stack
        direction='row'
        spacing={2}
        className='overflow-x-auto no-scrollbar p-1'
      >
        <FoodItemSkeleton />
        <FoodItemSkeleton />
        <FoodItemSkeleton />
      </Stack>
    </Box>
  )
}
