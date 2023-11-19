'use client'
import { Button } from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { type Colors } from '@/types/restaurant.type'
import toast from '@/utils/toast'
import React, { useState } from 'react'
import { GithubPlacement } from '@uiw/react-color-github'
import Chrome from '@uiw/react-color-chrome'
import useStore from '@/hooks/useStore'
import { useRestaurantStore } from '@/store/restaurantStore'
import { useCustomTheme } from '@/ui/theme'
import { trpc } from '@/trpc/trpcObject'

export default function ColorSettings() {
  const theme = useCustomTheme()
  const restaurantStore = useStore(useRestaurantStore, (state) => state)
  const { mutateAsync: updateColorsMutation } = trpc.updateColors.useMutation()
  const [valueName, setValueName] = useState<string>('')
  const [colorValue, setColorValue] = useState<string>('')

  const save = async (newColor: string): Promise<void> => {
    try {
      if (!restaurantStore) {
        throw new Error()
      }
      const currentColors = restaurantStore.colors
      const mergedColors = {
        ...currentColors,
        [valueName]: newColor,
      }
      const updatedColor = await updateColorsMutation(
        {
          restaurantId: restaurantStore.restaurantId,
          colors: mergedColors,
        },
        {
          onSuccess: displayErrorOrSuccess,
        }
      )
      restaurantStore.setColors(updatedColor.colors as Colors)
      setColorValue('')
      setValueName('')
    } catch (error) {
      toast.error('Fehler beim Speichern der Farben ')
    }
  }

  const displayErrorOrSuccess = (): void => {
    toast.success('Erfolgreich gespeichert')
  }

  return (
    restaurantStore &&
    restaurantStore.colors && (
      <ThemeProvider theme={theme}>
        <section style={{ display: 'flex', gap: '20px' }}>
          <form className='grid gap-5 w-fit'>
            <h2 className='text-lg'>Farbeinstellungen</h2>

            <label className='-mb-4'>Hauptfarbe</label>
            <Button
              sx={{ width: '100%' }}
              variant='outlined'
              color='primary'
              onClick={() => {
                setValueName('primary')
                setColorValue(restaurantStore.colors!.primary)
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
                setColorValue(restaurantStore.colors!.secondary)
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
                setColorValue(restaurantStore.colors!.accent)
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
                setColorValue(restaurantStore.colors!.textColor)
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
                color='success'
                onClick={() => {
                  save(colorValue)
                }}
              >
                Speichern
              </Button>
              <Button
                color='warning'
                onClick={() => {
                  setColorValue('')
                  setValueName('')
                }}
              >
                Verwerfen
              </Button>
            </div>
          )}
        </section>
      </ThemeProvider>
    )
  )
}
