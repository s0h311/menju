import { Button } from '@mui/material'
import { ChangeEvent, useRef } from 'react'

type ImagePickerProps = {
  onChange: (imageData: string, imageFile: File) => void
}

export default function ImagePicker({ onChange }: ImagePickerProps) {
  const input = useRef<HTMLInputElement | null>(null)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    if (input.files?.length) {
      const reader = new FileReader()
      const image = input.files[0]

      reader.onload = async (e) => {
        const imageData = e.target?.result?.toString() || ''
        onChange(imageData, image)
      }
      reader.readAsDataURL(image)
    }
  }

  return (
    <>
      <Button onClick={() => input.current?.click()}>Bild Auswählen</Button>
      <input
        ref={input}
        className='hidden'
        type='file'
        accept='image/*'
        onChange={(e) => handleChange(e)}
      />
    </>
  )
}
