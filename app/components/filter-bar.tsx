import { Chip, Stack } from '@mui/material'
import React from 'react'
import { FilterChipModel } from '@/app/model/filter-chip.model'

type FilterBarProps = {
  chipData: readonly FilterChipModel[]
  setChipData: React.Dispatch<React.SetStateAction<readonly FilterChipModel[]>>
}

export default function FilterBar({ chipData, setChipData }: FilterBarProps) {
  const handleClick = (clickedChip: FilterChipModel) => {
    setChipData((prevChipData) =>
      prevChipData.map((chip) => (chip.key === clickedChip.key ? { ...chip, clicked: !chip.clicked } : chip))
    )
  }

  return (
    <Stack spacing={1} direction='row' className='overflow-x-auto mt-4 no-scrollbar'>
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
