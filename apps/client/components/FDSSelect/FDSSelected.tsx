import React from "react"
import { Select, CheckIcon } from "native-base"

export type SelectData = {
  _id: string
  value: string
}

type FDSSelecteProps<T extends SelectData> = {
  selectedValue?: T["_id"]
  setSelectedValue: (value: T["_id"]) => void
  array: T[],
  placeholder?: string
}

export const FDSSelect = <T extends SelectData>({
  selectedValue, setSelectedValue, array, placeholder }: FDSSelecteProps<T>) => {
  return (
    <Select
      overflow={"hidden"}
      w={130}
      h={"6"}
      selectedValue={selectedValue}
      accessibilityLabel="Choose"
      placeholder={placeholder}
      onValueChange={itemValue => setSelectedValue(itemValue)}
      _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1}>
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
