import React from "react"
import { Select, CheckIcon } from "native-base"
import { ResponsiveValue } from "native-base/lib/typescript/components/types"

export type SelectData = {
  _id: string
  value: string
}

type FDSSelecteProps<T extends SelectData> = {
  selectedValue?: T["_id"]
  setSelectedValue: (value: T["_id"]) => void
  array: T[],
  placeholder?: string,
  w?: ResponsiveValue<number | string>,
  h?: ResponsiveValue<number | string>,
}

export const FDSSelect = <T extends SelectData>({
  selectedValue, setSelectedValue, array, placeholder, w, h }: FDSSelecteProps<T>) => {
  return (
    <Select
      overflow={"hidden"}
      w={w}
      h={h}
      selectedValue={selectedValue}
      accessibilityLabel="Choose"
      placeholder={placeholder}
      onValueChange={itemValue => setSelectedValue(itemValue)}
      _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }}>
      {array.map((item) =>
        <Select.Item
          key={item._id}
          label={item.value}
          value={item._id}
        />
      )}
    </Select>
  )
}
