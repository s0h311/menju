'use client'
import React, { useState } from 'react'
import Chrome from '@uiw/react-color-chrome'
import { GithubPlacement } from '@uiw/react-color-github'
import { Dialog } from '@mui/material/'
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined'
import { Button } from '@mui/material'

type ColorPickerProps = {
  color: string | null
  setColor: (value: string | null) => void
}
export default function ColorPickerDialog({ color, setColor }: ColorPickerProps) {
  const [hex, setHex] = useState('#d29c9c53')
  return (
    <Dialog
      open={!!color}
      onClose={() => setColor(null)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <div className='flex gap-10 xl:gap-20 w-full'>
        <Chrome
          color={hex}
          style={{ float: 'left' }}
          placement={GithubPlacement.Right}
          onChange={(color) => {
            setHex(color.hexa)
          }}
        />
        <div style={{ background: hex, marginTop: 30, padding: 10 }}>{hex}</div>
      </div>
      <Button
        variant='outlined'
        endIcon={<SaveAltOutlinedIcon />}
        onClick={() => setColor(null)}
      >
        Speichern
      </Button>
    </Dialog>
  )
}
