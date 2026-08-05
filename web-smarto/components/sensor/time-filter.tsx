"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { FilterType } from "@/types/sensor"

type TimeFilterProps = {
  value: FilterType
  onChange: (value: FilterType) => void
  disabled?: boolean
}

const filterOptions: {
  value: FilterType
  label: string
}[] = [
  {
    value: "day",
    label: "Last 1 Day",
  },
  {
    value: "month",
    label: "Last 1 Month",
  },
  {
    value: "year",
    label: "Last 1 Year",
  },
]

export function TimeFilter({ value, onChange, disabled }: TimeFilterProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(selectedValue) => {
        if (!selectedValue) return
        onChange(selectedValue as FilterType)
      }}
      className="flex flex-wrap justify-start gap-2"
      disabled={disabled}
    >
      {filterOptions.map((item) => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          className="h-10 rounded-md border px-4 text-xs font-medium uppercase data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
