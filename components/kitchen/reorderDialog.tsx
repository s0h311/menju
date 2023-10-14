import { forwardRef, useState } from 'react'
import type { ReactElement, Ref } from 'react'
import { Button, Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Grid } from '@mui/material/'
import { Close as CloseIcon } from '@mui/icons-material'
import type { TransitionProps } from '@mui/material/transitions'
import type { DishCategory, Dish, DishIntersection } from '@/types/dish.type'
import { closestCenter, DndContext } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { theme } from '@/ui/theme'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { trpc } from '@/trpc/trpc'
import useStore from '@/hooks/useStore'
import { useMenuStore } from '@/store/menuStore'
import useTypeTransformer from '@/hooks/useTypeTranformer'
import type { DBDish, DBDishCategory } from '@/types/db/dish.db.type'
import ReorderableItem from '@/components/kitchen/reorderableItem'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement
  },
  ref: Ref<unknown>
) {
  return (
    <Slide
      direction='up'
      ref={ref}
      {...props}
    />
  )
})

type ReorderDialogProps<T> = {
  items: T[]
  setOpenDialog: (value: T[] | null) => void
}

export default function ReorderDialog<T extends DishIntersection>({ items, setOpenDialog }: ReorderDialogProps<T>) {
  const [draggableItems, setItems] = useState<T[]>(items)
  const menuStore = useStore(useMenuStore, (state) => state)
  const updateDishCategoryMutation = trpc.updateDishCategory.useMutation()
  const { mutateAsync: updateDishMutation } = trpc.updateDish.useMutation()
  const { dishToDBDish, dishCategoryToDBDishCategory } = useTypeTransformer()

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id === over?.id) return

    setItems((draggableItems) => {
      const oldIndex = draggableItems.findIndex((item) => item.id === active.id)
      const newIndex = draggableItems.findIndex((item) => item.id === over?.id)

      if (oldIndex >= 0 && newIndex >= 0) {
        const oldItem = draggableItems[oldIndex]
        const newItem = draggableItems[newIndex]

        if (oldItem && newItem) {
          oldItem.priority = newIndex
          newItem.priority = oldIndex
        }
      }
      return arrayMove(draggableItems, oldIndex, newIndex)
    })
  }

  const submit = (): void => {
    const firstItem = draggableItems[0]

    if (!firstItem) return
    if (typeof firstItem === 'object' && 'ingredients' in firstItem) {
      submitDishes()
      return
    }
    submitDishCategories()
  }

  const submitDishes = async (): Promise<void> => {
    draggableItems.forEach((dish, index) => {
      dish.priority = index
      const dBDish: DBDish = dishToDBDish(dish as unknown as Dish)
      updateDishMutation(dBDish, {
        onSuccess: async (dish: Dish) => {
          menuStore?.updateDish(dish)
          setOpenDialog(null)
        },
      })
    })
  }

  const submitDishCategories = async (): Promise<void> => {
    draggableItems.forEach((dishCategory, index) => {
      dishCategory.priority = index
      const dBDishCategory: DBDishCategory = dishCategoryToDBDishCategory(dishCategory as unknown as DishCategory)
      updateDishCategoryMutation.mutateAsync(dBDishCategory, {
        onSuccess: async (dishCategory: DishCategory) => {
          menuStore?.updateDishCategory(dishCategory)
          setOpenDialog(null)
        },
      })
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        fullScreen
        open={!!draggableItems}
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
              onClick={submit}
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
