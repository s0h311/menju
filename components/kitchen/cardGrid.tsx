'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { Button, IconButton } from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { Add, ReplayRounded, ReorderRounded } from '@mui/icons-material'
import AddDishCategory from './addDishCategory'
import AddDish from './addDish'
import { useCustomTheme } from '@/ui/theme'

type CardGridProps = {
  title: string
  contentType: 'dishCategory' | 'dish'
  withReset?: boolean
  onReset?: () => void
  onReorder: () => void
  children: ReactNode
}

export default function CardGrid({ title, contentType, withReset, onReset, onReorder, children }: CardGridProps) {
  const theme = useCustomTheme()
  const [editingActive, setEditingActive] = useState<boolean>(false)

  return (
    <ThemeProvider theme={theme}>
      <div className='p-5 rounded-lg bg-gray-300 space-y-3 relative overflow-y-scroll'>
        <div className='flex items-center space-x-2'>
          <h2 className='text-lg'>{title}</h2>
          <Button onClick={() => setEditingActive(true)}>
            <Add />
          </Button>
        </div>
        <IconButton
          sx={{ position: 'absolute', right: withReset ? 50 : 5, top: 0 }}
          onClick={onReorder}
          color='primary'
        >
          <ReorderRounded />
        </IconButton>
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
          {editingActive && contentType === 'dishCategory' && (
            <AddDishCategory onClose={() => setEditingActive(false)} />
          )}
          {editingActive && contentType === 'dish' && (
            <AddDish
              open={editingActive}
              onClose={() => setEditingActive(false)}
            />
          )}
          {children}
        </div>
      </div>
    </ThemeProvider>
  )
}
