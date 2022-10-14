import { OrderStatus } from "../../../models/types";
import { z } from "zod";

export const CreateOrderDetail = z.object({
  tab: z.string(),
  user: z.string(),
  product: z.string(),
  quantity: z.number().optional().default(1),
  message: z.string().optional(),
})

const OrderDetail = z.object({
  product: z.string(),
  quantity: z.number(),
  message: z.string().optional(),
});

export const CreateMultipleOrdersDetail = z.object({
  user: z.string(),
  tab: z.string(),
  orderDetails: z.array(OrderDetail)
})

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