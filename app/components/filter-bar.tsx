import { Chip, Stack } from '@mui/material'
import React from 'react'
import { FilterChipModel } from '@/app/types/filter-chip.types'

type FilterBarProps = {
  chipData: readonly FilterChipModel[]
}

export default function FilterBar({ chipData }: FilterBarProps) {
  const activeFilters: FilterChipModel[] = []
  const handleClick = (clickedChip: FilterChipModel) => {
    activeFilters.includes(clickedChip)
      ? activeFilters.splice(activeFilters.indexOf(clickedChip), 1)
      : activeFilters.push(clickedChip)
  }

  return (
    <Stack
      spacing={1}
      direction='row'
      className='overflow-x-auto mt-4 no-scrollbar'
    >
      {chipData.map((data) => (
        <Chip
          key={data.key}
          label={data.label}
          color={data.clicked ? 'success' : 'error'}
          onClick={() => handleClick(data)}
          className={`transition-opacity ${data.clicked ? 'opacity-100' : 'opacity-90'}`}
        />
      ))}
    </Stack>
  )
}
