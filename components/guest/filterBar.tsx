import { Accordion, AccordionDetails, AccordionSummary, Chip } from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import type { FilterChipModel } from '@/types/filterChip.type'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useCustomTheme } from '@/ui/theme'
import { useState } from 'react'

type FilterBarProps = {
  chipData: FilterChipModel[]
  onFilter: (filters: FilterChipModel[]) => void
}

export default function FilterBar({ chipData, onFilter }: FilterBarProps) {
  const theme = useCustomTheme()

  const [activeFilters, setActiveFilters] = useState<FilterChipModel[]>(chipData)

  function handleFilter(filter: FilterChipModel): void {
    let filters = [...activeFilters]

    if (!!activeFilters.find((f) => f.label === filter.label)) {
      filters = filters.filter((f) => f.label !== filter.label)
    } else {
      filters.push(filter)
    }

    setActiveFilters(filters)
    onFilter(filters)
  }

  return (
    <ThemeProvider theme={theme}>
      <Accordion className='rounded sticky top-2 border border-primary z-[1]'>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h1 className='text-lg -my-2'>Filter</h1>
        </AccordionSummary>
        <AccordionDetails sx={{ marginTop: '-10px' }}>
          {chipData.map((filter: FilterChipModel) => (
            <Chip
              sx={{ m: '3px' }}
              variant='outlined'
              key={filter.label}
              label={filter.label}
              color={!!activeFilters.find((f) => f.label === filter.label) ? 'success' : 'error'}
              onClick={() => {
                handleFilter(filter)
              }}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  )
}
