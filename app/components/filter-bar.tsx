import { Chip, Stack } from '@mui/material'
import React from 'react'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { useMenuStore } from '@/store/menu-store'

type FilterBarProps = {
  chipData: FilterChipModel[]
}

export default function FilterBar({ chipData }: FilterBarProps) {
  const menuStore = useMenuStore((state) => state)

  return (
    <Stack
      spacing={1}
      direction='row'
      className='overflow-x-auto mt-4 no-scrollbar'
    >
      {chipData.map((filter: FilterChipModel) => (
        <Chip
          key={filter.label}
          label={filter.label}
          onClick={() => {
            menuStore.updateFilter(filter)
            menuStore.filter()
          }}
        />
      ))}
    </Stack>
  )
}
