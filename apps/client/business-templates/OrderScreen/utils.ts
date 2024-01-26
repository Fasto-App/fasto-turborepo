import { ColorSchemeType } from "native-base/lib/typescript/components/types";
import { OrderStatus } from "../../gen/generated";
import { format } from "date-fns";
import { getLocale } from "../../authUtilities/utils";
import router from "next/router";

export const getOrderColor = (status?: OrderStatus): ColorSchemeType => {
	switch (status) {
		case OrderStatus.Open:
			return "blue";
		case OrderStatus.Closed:
			return "red";
		case OrderStatus.Pendent:
			return "yellow";
		case OrderStatus.Delivered:
			return "green";
		default:
			return "gray";
	}
};

export const formatDateFNS = (date?: string) =>
	format(Number(date || 0), "PPp", getLocale(router.locale));
