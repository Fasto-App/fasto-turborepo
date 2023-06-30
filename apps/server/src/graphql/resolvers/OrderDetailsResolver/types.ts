import { OrderStatus } from "app-helpers"
import { z } from "zod";

export const CreateOrderDetail = z.object({
  tab: z.string().optional(),
  product: z.string(),
  user: z.string().optional(),
  quantity: z.number().optional().default(1),
  message: z.string().optional(),
})

export const CreateMultipleOrdersDetail = z.array(CreateOrderDetail)
export interface CreateOrderDetailInput {
  input: z.infer<typeof CreateOrderDetail>
}
export interface CreateMultipleOrdersDetailInput {
  input: z.infer<typeof CreateMultipleOrdersDetail>
}

export const UpdateOrderDetail = z.object({
  _id: z.string(),
  quantity: z.number().optional(),
  message: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
})

export interface UpdateOrderDetailInput {
  input: z.infer<typeof UpdateOrderDetail>
}