import { Select, InputLabel, MenuItem, FormControl, SelectChangeEvent } from '@mui/material'
import { ChangeEvent, Ref } from 'react'

type FormDropdownProps = {
  label: string
  register: {
    onChange: (event: SelectChangeEvent) => void
    onBlur: (event: ChangeEvent) => void
    ref: Ref<HTMLInputElement>
    name: string
  }
  error: boolean
  items: { id: string | number; name: string | number }[]
}

export default function FormDropdown({ label, register, error, items }: FormDropdownProps) {
  return (
    <FormControl>
      <InputLabel id={`${label}-selection-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-selection-label`}
        id={`${label}-selection`}
        label={label}
        required
        {...register}
        error={error}
      >
        {items.map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
