import { Select, InputLabel, MenuItem, FormControl, SelectChangeEvent } from '@mui/material'

type FormDropdownProps = {
  label: string
  onChange: (value: number) => void
  error: boolean
  items: { id: string | number; name: string }[]
  selectedValue?: number
}

export default function FormDropdown({ label, onChange, error, items, selectedValue }: FormDropdownProps) {
  return (
    <FormControl>
      <InputLabel id={`${label}-selection-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-selection-label`}
        id={`${label}-selection`}
        label={label}
        required
        onChange={(event: SelectChangeEvent) => onChange(parseInt(event.target.value))}
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
