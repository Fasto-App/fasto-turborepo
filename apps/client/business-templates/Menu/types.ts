import { GetAllMenusByBusinessIdQueryResult } from "../../gen/generated";

export type AllMenusbyBusiness = NonNullable<
	GetAllMenusByBusinessIdQueryResult["data"]
>["getAllMenusByBusinessID"];
export type Product = NonNullable<
	NonNullable<
		NonNullable<AllMenusbyBusiness[0]>["sections"]
	>[number]["products"]
>[number];
