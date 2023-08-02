import { Chip, Stack } from '@mui/material'
import React, { useState } from 'react'
import { FilterChipModel } from '@/app/types/filter-chip.types'

type FilterBarProps = {
  chipData: FilterChipModel[]
}

export default function FilterBar({ chipData }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<FilterChipModel[]>([])

  const handleClick = (clickedChip: FilterChipModel): void => {
    if (activeFilters.includes(clickedChip)) {
      setActiveFilters(activeFilters.filter((filter) => filter !== clickedChip))
    } else {
      setActiveFilters([...activeFilters, clickedChip])
    }
  }

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
          onClick={() => handleClick(filter)}
          color={activeFilters.includes(filter) ? 'success' : 'error'}
          className={`transition-opacity ${activeFilters.includes(filter) ? 'opacity-100' : 'opacity-90'}`}
        />
      ))}
    </Stack>
  )
}
