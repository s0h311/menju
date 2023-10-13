import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import type { TransitionProps } from '@mui/material/transitions'
import type { DishCategory, Dish } from '@/types/dish.type'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { theme } from '@/ui/theme'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { trpc } from '@/trpc/trpc'
import useStore from '@/hooks/useStore'
import { useMenuStore } from '@/store/menuStore'
import useTypeTransformer from '@/hooks/useTypeTranformer'
import type { DBDish, DBDishCategory } from '@/types/db/dish.db.type'
import ReorderableItem from '@/components/kitchen/reorderableItem'
import { Grid } from '@mui/material'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return (
    <Slide
      direction='up'
      ref={ref}
      {...props}
    />
  )
})
type ReorderDialogProps = {
  items: DishCategory[] | Dish[]
  setOpenDialog: (value: DishCategory[] | Dish[] | null) => void
}
export default function ReorderDialog({ items, setOpenDialog }: ReorderDialogProps) {
  const [draggableItems, setItems] = useState(items)
  const menuStore = useStore(useMenuStore, (state) => state)
  const updateDishCategoryMutation = trpc.updateDishCategory.useMutation()
  const { mutateAsync: updateDishMutation } = trpc.updateDish.useMutation()
  const { dishToDBDish, dishCategoryToDBDishCategory } = useTypeTransformer()

  const isDish = (item: Dish | DishCategory) => typeof item === 'object' && 'ingredients' in item
  const onDragEnd = (event) => {
    const { active, over } = event
    if (active.id === over.id) {
      return
    }
    setItems((draggableItems) => {
      const oldIndex = draggableItems.findIndex((item) => item.id === active.id)
      const newIndex = draggableItems.findIndex((item) => item.id === over.id)
      draggableItems[oldIndex].priority = newIndex
      draggableItems[newIndex].priority = oldIndex
      return arrayMove(draggableItems, oldIndex, newIndex)
    })
  }

  const submitDishes = async (): Promise<void> => {
    for (const dish in draggableItems) {
      const dBDish: DBDish = dishToDBDish(draggableItems[dish])
      updateDishMutation(dBDish, {
        onSuccess: async (dish: Dish) => {
          menuStore?.updateDish(dish)
          setOpenDialog(null)
        },
      })
    }
  }
  const submitDishCategories = async (): Promise<void> => {
    for (const dishCategory in draggableItems) {
      const dBDishCategory: DBDishCategory = dishCategoryToDBDishCategory(draggableItems[dishCategory])
      updateDishCategoryMutation.mutateAsync(dBDishCategory, {
        onSuccess: async (dishCategory: DishCategory) => {
          menuStore?.updateDishCategory(dishCategory)
          setOpenDialog(null)
        },
      })
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        fullScreen
        open={draggableItems != null}
        onClose={() => setOpenDialog(null)}
        TransitionComponent={Transition}
        color='primary'
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={() => setOpenDialog(null)}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1 }}
              variant='h6'
              component='div'
            >
              Anzeigereihenfolge
            </Typography>
            <Button
              autoFocus
              color='inherit'
              onClick={() => (isDish(draggableItems[0]) ? submitDishes() : submitDishCategories())}
            >
              speichern
            </Button>
          </Toolbar>
        </AppBar>
        <Grid
          container
          margin={1}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={draggableItems}
              strategy={verticalListSortingStrategy}
            >
              {draggableItems
                .sort((item0, item1) => item0.priority - item1.priority)
                .map((item) => (
                  <ReorderableItem
                    item={item}
                    key={item.id}
                  />
                ))}
            </SortableContext>
          </DndContext>
        </Grid>
      </Dialog>
    </ThemeProvider>
  )
}
