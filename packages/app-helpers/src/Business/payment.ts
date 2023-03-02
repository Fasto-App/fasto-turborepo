import { z } from "zod";
import { splitType } from "./checkout";

export const paymentSchema = z.object({
  _id: z.string(),
  amount: z.number().min(0, { message: 'Amount must be greater than 0' }),
  tip: z.number().optional(),
  patron: z.string().optional(),
  paymentMethod: z.string().optional(),
  splitType: z.enum(splitType).optional(),
})

export type PaymentType = z.infer<typeof paymentSchema>