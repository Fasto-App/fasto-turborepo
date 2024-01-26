import { z } from "zod";
import { splitType } from "./checkout";

export const paymentSchema = z.object({
	checkout: z.string(),
	amount: z.number().min(1, { message: "error.required" }),
	tip: z.number().min(0),
	discount: z.number().min(0),
	patron: z.string(),
	paymentMethod: z.string().optional(),
	splitType: z.enum(splitType).optional(),
});

export type PaymentType = z.infer<typeof paymentSchema>;
