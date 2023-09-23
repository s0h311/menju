import { Select, InputLabel, MenuItem, FormControl, SelectChangeEvent } from '@mui/material'

type FormDropdownProps<T> = {
  label: string
  onChange: (value: T) => void
  error: boolean
  items: { id: string | number; name: string }[] | []
  selectedValue?: T
}

export default function FormDropdown<T extends string | number>({
  label,
  onChange,
  error,
  items,
  selectedValue,
}: FormDropdownProps<T>) {
  return (
    <FormControl>
      <InputLabel id={`${label}-selection-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-selection-label`}
        id={`${label}-selection`}
        label={label}
        required
        onChange={(event: SelectChangeEvent) => {
          const value = typeof selectedValue === 'number' ? parseInt(event.target.value) : event.target.value
          onChange(value as T)
        }}
        error={error}
        value={String(selectedValue)}
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
