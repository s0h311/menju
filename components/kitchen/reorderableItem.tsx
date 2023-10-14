import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Avatar, Card, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import Image from 'next/image'
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined'

type ReorderableItemProps<T> = {
  item: T
}

export default function ReorderableItem<
  T extends {
    id: number
    priority: number
    picture: string
    name: string
  },
>({ item }: ReorderableItemProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='user'
      sx={{ m: 1, h: 200, w: 350 }}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            {item.picture ? (
              <Image
                src={item.picture}
                fill
                alt=''
              />
            ) : (
              <FastfoodOutlinedIcon />
            )}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={item.name} />
      </ListItem>
    </Card>
  )
}
