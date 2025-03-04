import { Button } from '@mui/material'
import { useRef } from 'react'
import type { ChangeEvent } from 'react'

type ImagePickerProps = {
  onChange: (imageData: string, imageFile: File) => void
}

export default function ImagePicker({ onChange }: ImagePickerProps) {
  const inputElement = useRef<HTMLInputElement | null>(null)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    if (input.files?.length) {
      const reader = new FileReader()
      const image = input.files[0]

      if (!image) return

      reader.onload = async (e) => {
        const imageData = e.target?.result?.toString() || ''
        onChange(imageData, image)
      }
      reader.readAsDataURL(image)
    }
  }

  return (
    <>
      <Button
        sx={{ width: '100%' }}
        variant='outlined'
        onClick={() => inputElement.current?.click()}
      >
        Bild Auswählen
      </Button>
      <input
        ref={inputElement}
        className='hidden'
        type='file'
        accept='image/*, image/avif'
        onChange={(e) => handleChange(e)}
      />
    </>
  )
}
