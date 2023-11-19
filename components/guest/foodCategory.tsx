import { Box, Divider, Stack } from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import FoodItem from './foodItem'
import type { Dish, DishCategory } from '@/types/dish.type'
import { useCustomTheme } from '@/ui/theme'

type FoodCategoryProps = {
  category: DishCategory
  dishes: Dish[]
  onCardClick: (dish: Dish) => void
  hasPriority?: boolean
}
export default function FoodCategory({ category, dishes, onCardClick, hasPriority = false }: FoodCategoryProps) {
  return (
    <ThemeProvider theme={useCustomTheme()}>
      <Box className='mb-4'>
        <h1 className='text-2xl'>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</h1>
        <Divider
          orientation='horizontal'
          flexItem
          className='mb-2'
        />

        <Stack
          direction='row'
          spacing={2}
          className='overflow-x-auto no-scrollbar p-1'
        >
          {dishes.length > 0 &&
            dishes
              .sort((dish0, dish1) => dish0.priority - dish1.priority)
              .map((dish, index) => (
                <FoodItem
                  key={dish.id}
                  dish={dish}
                  priority={hasPriority && index <= 1}
                  onClick={() => onCardClick(dish)}
                />
              ))}
        </Stack>
      </Box>
    </ThemeProvider>
  )
}
