import { ReactNode } from 'react'
import {
  Card as MCard,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  ThemeProvider,
  IconButton,
  CardActionArea,
} from '@mui/material'
import { EditRounded, DeleteForeverRounded } from '@mui/icons-material'
import { theme } from '@/app/ui/theme'

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
            sx={{ height: '13dvh' }}
            component='img'
            image={image}
          />
          <CardContent>
            <Typography
              sx={{ fontSize: '18px', whiteSpace: 'nowrap' }}
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
