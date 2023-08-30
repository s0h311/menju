'use client'

import { ReactNode, useState } from 'react'
import { Button, IconButton, ThemeProvider } from '@mui/material'
import { Add, ReplayRounded } from '@mui/icons-material'
import { theme } from '@/app/ui/theme'
import AddDishCategory from './addDishCategory'

type CardGridProps = {
  title: string
  withReset?: boolean
  onReset?: () => void
  children: ReactNode
}

export default function CardGrid({ title, withReset, onReset, children }: CardGridProps) {
  const [editingActive, setEditingActive] = useState<boolean>(false)

  return (
    <ThemeProvider theme={theme}>
      <div className='p-5 rounded-lg bg-gray-300 space-y-3 relative overflow-y-scroll'>
        <h2 className='text-lg'>{title}</h2>
        {withReset && (
          <IconButton
            sx={{ position: 'absolute', right: 5, top: 0 }}
            onClick={onReset}
            color='primary'
          >
            <ReplayRounded />
          </IconButton>
        )}
        <div className='grid grid-cols-2 xl:grid-cols-3 gap-5'>
          {!editingActive ? (
            <Button
              variant='outlined'
              onClick={() => setEditingActive(true)}
            >
              <Add />
            </Button>
          ) : (
            <AddDishCategory onClose={() => setEditingActive(false)} />
          )}
          {children}
        </div>
      </div>
    </ThemeProvider>
  )
}
