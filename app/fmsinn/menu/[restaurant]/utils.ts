import { Dish, DishesByCategory } from '@/app/types/dish.type'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { ZodString } from 'zod'

export function getFilterChips(dishesByCategory: DishesByCategory[] | undefined): FilterChipModel[] {
  const filterChips: FilterChipModel[] = []
  dishesByCategory?.forEach(({ dishes }: DishesByCategory) => {
    dishes.forEach(({ allergies, labels }: Dish) => {
      getFilterChipsFromAllergies(allergies).forEach((chip) => {
        if (!filterChips.some(({ label }) => label === chip.label)) {
          filterChips.push(chip)
        }
      })
      getFilterChipsFromLabels(labels).forEach((chip) => {
        if (!filterChips.some(({ label }) => label === chip.label)) {
          filterChips.push(chip)
        }
      })
    })
  })
  return filterChips
}

function getFilterChipsFromAllergies(allergies: ZodString['_output'][]): FilterChipModel[] {
  const filterChips: FilterChipModel[] = []
  allergies.forEach((allergy: string) => {
    filterChips.push({ key: Math.floor(Math.random() * 1000), label: allergy })
  })
  return filterChips
}

function getFilterChipsFromLabels(labels: ZodString['_output'][]): FilterChipModel[] {
  const filterChips: FilterChipModel[] = []
  labels.forEach((label: string) => {
    filterChips.push({ key: Math.floor(Math.random() * 1000), label })
  })
  return filterChips
}
