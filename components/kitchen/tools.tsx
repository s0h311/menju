'use client'

import { LoadingButton } from '@mui/lab'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import QRCodeDialog from '@/components/kitchen/qrCodeDialog'
import useStore from '@/hooks/useStore'
import { useRestaurantStore } from '@/store/restaurantStore'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { useCustomTheme } from '@/ui/theme'

export default function Tools() {
  const theme = useCustomTheme()
  const [tableIdentification, setTableIdentification] = useState<string | null>(null)
  const [qrCode, setQRCode] = useState<string | null>(null)
  const restaurantStore = useStore(useRestaurantStore, (state) => state)

  return (
    <ThemeProvider theme={theme}>
      <section>
        <Stack spacing={2}>
          <h1>QR-Codes</h1>
          <TextField
            id='outlined-basic'
            label='Tischbezeichnung'
            variant='outlined'
            value={tableIdentification}
            onChange={(event) => setTableIdentification(event.target.value)}
            inputProps={{
              maxLength: 20,
            }}
          />
          <LoadingButton
            variant='outlined'
            type='submit'
            endIcon={<AddCircleOutlineIcon />}
            onClick={() => {
              setQRCode(tableIdentification)
              setTableIdentification('')
            }}
          >
            QR-Code erstellen
          </LoadingButton>
        </Stack>

        {qrCode && (
          <QRCodeDialog
            qrCode={'https://menju.co/menu?r=' + restaurantStore?.restaurantId + '&t=' + qrCode}
            setQRCode={setQRCode}
          />
        )}
      </section>
    </ThemeProvider>
  )
}
