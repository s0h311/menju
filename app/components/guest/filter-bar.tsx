import { Chip, Stack } from '@mui/material'
import React from 'react'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { useMenuStore } from '@/store/menu-store'
import useStore from '@/store/nextjs-hook'

type FilterBarProps = {
  chipData: FilterChipModel[]
}

export default function FilterBar({ chipData }: FilterBarProps) {
  const menuStore = useStore(useMenuStore, (state) => state)
  function isFilterActive(filterLabel: string): Boolean {
    var isFilterActive = false
    menuStore?.activeFilter.map((filter) => {
      if (filter.label === filterLabel) {
        isFilterActive = true
      }
    })
    return isFilterActive
  }

  return (
    <Stack
      spacing={1}
      direction='row'
      className='overflow-x-auto mt-4 no-scrollbar'
    >
      {chipData.map((filter: FilterChipModel) => (
        <Chip
          variant='outlined'
          key={filter.label}
          label={filter.label}
          color={isFilterActive(filter.label) ? 'success' : 'error'}
          style={{ backgroundColor: '#fcfaf2' }}
          onClick={() => {
            menuStore?.updateFilter(filter)
            menuStore?.filter()
          }}
        />
      ))}
    </Stack>
  )
}
