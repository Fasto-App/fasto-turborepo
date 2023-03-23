import { GetCheckoutByIdQueryHookResult } from "../../gen/generated";

export type Checkout = Partial<Omit<NonNullable<GetCheckoutByIdQueryHookResult["data"]>["getCheckoutByID"], "__typename" | "_id">>;