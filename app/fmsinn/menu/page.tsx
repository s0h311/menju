'use client'

import React from 'react'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import FilterBar from '@/app/components/filter-bar'
import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import FoodCategory from '@/app/components/food-category'
import { FoodCategoryModel } from '@/app/types/food-category.types'

export default function Menu() {
  const createChipData = (): readonly FilterChipModel[] => [
    { key: 0, label: 'Vegan', clicked: false },
    { key: 1, label: 'Histamin', clicked: false },
    { key: 2, label: 'Gluten', clicked: false },
    { key: 3, label: 'Vegetarisch', clicked: false },
    { key: 4, label: 'Fleisch', clicked: false },
    { key: 5, label: 'Filter1', clicked: false },
    { key: 6, label: 'Filter2', clicked: false },
    { key: 7, label: 'Filter3', clicked: false },
    { key: 8, label: 'Filter4', clicked: false },
    { key: 9, label: 'Filter5', clicked: false },
  ]

  const [chipData, setChipData] = useState<readonly FilterChipModel[]>(createChipData())
  const foodData: FoodCategoryModel[] = [
    {
      key: 0,
      label: 'Frühstück',
      items: [
        { key: 0, label: 'Rühreier' },
        { key: 1, label: 'Brötchen' },
      ],
    },
    { key: 1, label: 'Mittagessen', items: [{ key: 2, label: 'Döner' }] },
    { key: 2, label: 'Abendessen', items: [{ key: 3, label: 'Tomaten' }] },
    {
      key: 3,
      label: 'Getränke',
      items: [
        { key: 4, label: 'Wasser' },
        { key: 4, label: 'Kaffee' },
        { key: 4, label: 'Tee' },
        {
          key: 4,
          label: 'Cola',
        },
      ],
    },
  ]
  return (
    <Stack className='mb-4'>
      <Box className='sticky top-0 z-10'>
        <FilterBar chipData={chipData} setChipData={setChipData} />
      </Box>
      {foodData.map((data) => {
        return <FoodCategory key={data.key} label={data.label} items={data.items} />
      })}
    </Stack>
  )
}
