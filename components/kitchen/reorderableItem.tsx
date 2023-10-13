import { Dish, DishCategory } from '@/types/dish.type'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import Image from 'next/image'
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined'
import * as React from 'react'

type ReorderableItemProps = {
  item: DishCategory | Dish
}
export default function ReorderableItem({ item }: ReorderableItemProps) {
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
