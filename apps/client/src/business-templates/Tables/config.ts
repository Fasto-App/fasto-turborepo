import { TabStatus, TableStatus } from "../../gen/generated";
import { TableStatusType } from "app-helpers";

type statStruct = {
	number: number;
	name: TableStatus;
};

export const stats: Record<TableStatusType, statStruct> = {
	Occupied: {
		number: 1,
		name: TableStatus.Occupied,
	},
	Reserved: {
		number: 1,
		name: TableStatus.Reserved,
	},
	Available: {
		number: 1,
		name: TableStatus.Available,
	},
	Closed: {
		number: 1,
		name: TableStatus.Closed,
	},
};

export const borderColor = (status?: TableStatusType) => {
	switch (status) {
		case "Occupied":
			return "primary.600";
		case "Reserved":
			return "muted.300";
		case "Available":
			return "tertiary.700";
		default:
			return "tertiary.600";
	}
};

export const badgeScheme = (status?: TableStatus | TabStatus) => {
	switch (status) {
		case "Occupied":
			return "danger";
		case "Reserved":
			return "coolGray";
		case "Available":
			return "success";
		default:
			return "coolGray";
	}
};
