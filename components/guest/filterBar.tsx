import { Accordion, AccordionDetails, AccordionSummary, Chip } from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import type { FilterChipModel } from '@/types/filterChip.type'
import { useMenuStore } from '@/store/menuStore'
import useStore from '@/hooks/useStore'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useCustomTheme } from '@/ui/theme'

type FilterBarProps = {
  chipData: FilterChipModel[]
}

export default function FilterBar({ chipData }: FilterBarProps) {
  const theme = useCustomTheme()
  const menuStore = useStore(useMenuStore, (state) => state)
  const isFilterActive = (filterLabel: string): boolean => {
    let isFilterActive = false
    menuStore?.activeFilter.map((filter) => {
      if (filter.label === filterLabel) {
        isFilterActive = true
      }
    })
    return isFilterActive
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
              color={isFilterActive(filter.label) ? 'success' : 'error'}
              onClick={() => {
                menuStore?.updateFilter(filter)
                menuStore?.filter()
              }}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  )
}
