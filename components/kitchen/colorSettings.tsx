'use client'
import { Button } from '@mui/material'
import { theme } from '@/ui/theme'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { type Colors } from '@/types/restaurant.type'
import { trpc } from '@/trpc/trpc'
import toast from '@/utils/toast'
import React, { useState } from 'react'
import { GithubPlacement } from '@uiw/react-color-github'
import Chrome from '@uiw/react-color-chrome'

type ColorSettingProps = {
  restaurantId: number
  colors: Colors
}
export default function ColorSettings({ restaurantId, colors }: ColorSettingProps) {
  const { mutateAsync: updateColorsMutation } = trpc.updateColors.useMutation()
  const [valueName, setValueName] = useState<string>('')
  const [colorValue, setColorValue] = useState<string>('')

  const save = async (newColors: Colors): Promise<void> => {
    updateColorsMutation(
      {
        restaurantId: restaurantId,
        colors: newColors,
      },
      {
        onSuccess: displayErrorOrSuccess,
      }
    )
  }

  const displayErrorOrSuccess = (): void => {
    toast.success('Erfolgreich gespeichert')
  }

  return (
    <ThemeProvider theme={theme}>
      <section style={{ display: 'flex', gap: '20px' }}>
        <form className='grid gap-5 w-fit'>
          <h2 className='text-lg'>Farben</h2>

          <label className='-mb-4'>Hauptfarbe</label>
          <Button
            sx={{ width: '100%' }}
            variant='outlined'
            color='primary'
            onClick={() => {
              setValueName('primary')
              setColorValue(colors.primary)
            }}
          >
            Bearbeiten
          </Button>

          <label className='-mb-4'>Sekundärfarbe</label>
          <Button
            sx={{ width: '100%' }}
            variant='outlined'
            color='secondary'
            onClick={() => {
              setValueName('secondary')
              setColorValue(colors.secondary)
            }}
          >
            Bearbeiten
          </Button>

          <label className='-mb-4'>Akzentfarbe</label>
          <Button
            sx={{ width: '100%' }}
            variant='outlined'
            color='accent'
            onClick={() => {
              setValueName('accent')
              setColorValue(colors.accent)
            }}
          >
            Bearbeiten
          </Button>

          <label className='-mb-4'>Textfarbe</label>
          <Button
            sx={{ width: '100%' }}
            variant='outlined'
            color='textColor'
            onClick={() => {
              setValueName('textColor')
              setColorValue(colors.textColor)
            }}
          >
            Bearbeiten
          </Button>
        </form>
        {colorValue !== '' && valueName !== '' && (
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 50 }}>
            <Chrome
              color={colorValue}
              style={{ float: 'left' }}
              placement={GithubPlacement.Right}
              onChange={(color) => {
                setColorValue(color.hexa)
              }}
            />
            <Button
              onClick={() => {
                setColorValue('')
                setValueName('')
              }}
              color={valueName}
            >
              Speichern
            </Button>
          </div>
        )}
      </section>
    </ThemeProvider>
  )
}
