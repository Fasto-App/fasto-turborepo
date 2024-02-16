import { ColorSchemeType } from "native-base/lib/typescript/components/types"
import { OrderStatus } from "../../gen/generated"

export const getOrderColor = (status?: OrderStatus): ColorSchemeType => {
  switch (status) {
    case OrderStatus.Open:
      return "blue"
    case OrderStatus.Closed:
      return "red"
    case OrderStatus.Pendent:
      return "yellow"
    case OrderStatus.Delivered:
      return "green"
    default:
      return "gray"
  }
}