import {Accordion, AccordionDetails, AccordionSummary, Chip, ThemeProvider} from '@mui/material'
import React from 'react'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { useMenuStore } from '@/store/menu-store'
import useStore from '@/store/nextjs-hook'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {theme} from "@/app/ui/theme";

type FilterBarProps = {
  chipData: FilterChipModel[]
}

export default function FilterBar({ chipData }: FilterBarProps) {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

  const menuStore = useStore(useMenuStore, (state) => state)
  function isFilterActive(filterLabel: string): boolean {
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
      <Accordion className="sticky top-2 opacity-95 bg-secondary"  expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ maxWidth: '100%'}}>
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
              >
                  <h1
                      className='text-lg'
                  >
                      Filter
                  </h1>
              </AccordionSummary>
              <AccordionDetails>
                  {chipData.map((filter: FilterChipModel) => (
                      <Chip
                          className={'mb-1 mr-1'}
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
