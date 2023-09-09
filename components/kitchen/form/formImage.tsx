import ImagePicker from '@/components/kitchen/imagePicker'
import { TextField } from '@mui/material'
import { Ref, ChangeEvent } from 'react'

type FormImageProps = {
  onImageChange: (imageData: string, file: File) => void
  register: {
    onChange: (event: ChangeEvent) => void
    onBlur: (event: ChangeEvent) => void
    ref: Ref<HTMLInputElement>
    name: string
  }
  error: {
    error: boolean
    helperText: string | undefined
  }
}

export default function FormImage({ onImageChange, register, error }: FormImageProps) {
  return (
    <>
      <ImagePicker onChange={onImageChange} />
      <TextField
        id='pictureUrl'
        label='Bild Link'
        color='accent'
        {...register}
        {...error}
      />
    </>
  )
}
