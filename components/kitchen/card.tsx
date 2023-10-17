import type { ReactNode } from 'react'
import {
  Card as MCard,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  IconButton,
  CardActionArea,
} from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { EditRounded, DeleteForeverRounded } from '@mui/icons-material'
import { theme } from '@/ui/theme'
import Image from 'next/image'

export type CardProps = {
  title: string
  image?: string
  children?: ReactNode
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function Card({ title, image, onClick, onDelete, onEdit, children }: CardProps) {
  return (
    <ThemeProvider theme={theme}>
      <MCard sx={{ cursor: 'pointer' }}>
        <CardActionArea onClick={onClick}>
          <CardMedia
            sx={{ height: '13dvh', position: 'relative' }}
            component='div'
          >
            <Image
              style={{ objectFit: 'cover' }}
              src={image ?? ''}
              fill
              sizes='23dvw'
              quality={70}
              alt=''
            />
          </CardMedia>

          <CardContent>
            <Typography
              sx={{ fontSize: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              gutterBottom
            >
              {title}
            </Typography>
            <Typography variant='body2'>{children}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton
            color='primary'
            onClick={onEdit}
          >
            <EditRounded />
          </IconButton>
          <IconButton
            color='primary'
            onClick={onDelete}
          >
            <DeleteForeverRounded />
          </IconButton>
        </CardActions>
      </MCard>
    </ThemeProvider>
  )
}
