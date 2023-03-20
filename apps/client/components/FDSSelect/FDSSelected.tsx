import React from "react"
import { Select, CheckIcon } from "native-base"
import { Percentages } from "../../business-templates/Checkout/checkoutStore"

type FDSSelecteProps = {
  selectedValue?: string
  setSelectedValue: (value: string) => void
  array: string[] // todo: {_id: string, value: string}[]
}

export const FDSSelect = ({ selectedValue, setSelectedValue, array }: FDSSelecteProps) => {
  return (
    <Select
      overflow={"hidden"}
      w={130}
      h={"6"}
      selectedValue={selectedValue}
      accessibilityLabel="Choose Service"
      placeholder="0%"
      onValueChange={itemValue => setSelectedValue(itemValue)}
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
