import React from "react"
import { Select, CheckIcon } from "native-base"
import { Percentages } from "../../business-templates/Checkout/checkoutStore"

type FDSSelecteProps<T extends string> = {
  selectedValue?: T
  setSelectedValue: (value: T) => void
  array: T[] // todo: {_id: string, value: string}[]
}

export const FDSSelect = <T extends string>({ selectedValue, setSelectedValue, array }: FDSSelecteProps<T>) => {
  return (
    <Select
      overflow={"hidden"}
      w={130}
      h={"6"}
      selectedValue={selectedValue}
      accessibilityLabel="Choose Service"
      placeholder="0%"
      onValueChange={itemValue => setSelectedValue(itemValue as T)}
      _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1}>
      {array.map((percentage) =>
        <Select.Item
          key={percentage}
          label={percentage}
          value={percentage}
        />
      )}
    </Select>
  )
}
