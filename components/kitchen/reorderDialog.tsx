import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { DishCategory, Dish } from '@/types/dish.type'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import Image from 'next/image'
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined'
import { theme } from '@/ui/theme'
import ThemeProvider from '@mui/material/styles/ThemeProvider'

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

  const SortableItem = ({ item }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })
    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    }
    return (
      <ListItem
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className='user'
      >
        <ListItemAvatar>
          <Avatar>
            {item.picture ? (
              <Image
                src={item.picture}
                alt={''}
              />
            ) : (
              <FastfoodOutlinedIcon></FastfoodOutlinedIcon>
            )}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item.name}
          secondary={item.priority}
        />
      </ListItem>
    )
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
              onClick={() => setOpenDialog(null)}
            >
              speichern
            </Button>
          </Toolbar>
        </AppBar>
        <List sx={{ bgcolor: 'background.paper' }}>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={draggableItems}
              strategy={verticalListSortingStrategy}
            >
              {draggableItems.map((item) => (
                <div key={item.id}>
                  <SortableItem item={item} />
                  <Divider />
                </div>
              ))}
            </SortableContext>
          </DndContext>
        </List>
      </Dialog>
    </ThemeProvider>
  )
}
