import { ToggleButtonGroup, ToggleButton as MToggleButton } from '@mui/material'
import { Key } from 'react'
import { MouseEvent } from 'react'

type ToggleButtonProps<T> = {
  value: T | T[]
  onChange: (value: T) => void
  items: { value: T; name: string }[]
  isMultiSelect?: boolean
}

export default function ToggleButton<T>({ value, onChange, items, isMultiSelect }: ToggleButtonProps<T>) {
  return (
    <ToggleButtonGroup
      exclusive={!isMultiSelect}
      size='medium'
      color='success'
      value={value}
      onChange={(_event: MouseEvent<HTMLElement>, newValue: T | null) => {
        if (newValue !== null) onChange(newValue)
      }}
    >
      {items.map((item) => (
        <MToggleButton
          key={item.value as Key}
          value={item.value!}
        >
          {item.name}
        </MToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
