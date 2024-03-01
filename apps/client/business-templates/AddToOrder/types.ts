import { Product } from "../../gen/generated";

export type NewOrder = Product & { orderQuantity: number; selectedUser?: string, productId: string };

export type OrderState = Record<string, NewOrder>