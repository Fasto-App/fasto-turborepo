import React from "react";
import { Select, CheckIcon, ChevronDownIcon } from "native-base";
import { ResponsiveValue } from "native-base/lib/typescript/components/types";

export type SelectData = {
	_id: string;
	value: string;
};

type FDSSelecteProps<T extends SelectData> = {
	selectedValue?: T["_id"];
	setSelectedValue: (value: T["_id"]) => void;
	array: T[];
	placeholder?: string;
	w?: ResponsiveValue<number | string>;
	h?: ResponsiveValue<number | string>;
};

export const NotMemoizedFDSSelect = <T extends SelectData>({
	selectedValue,
	setSelectedValue,
	array,
	placeholder,
	w,
	h,
}: FDSSelecteProps<T>) => {
	return (
		<Select
			backgroundColor={"white"}
			w={w}
			h={h}
			overflow={"hidden"}
			fontSize={"lg"}
			selectedValue={selectedValue}
			placeholder={placeholder}
			onValueChange={setSelectedValue}
			dropdownIcon={<ChevronDownIcon size="4" p="1" />}
			_selectedItem={{
				bg: "teal.600",
				endIcon: <CheckIcon size="5" />,
			}}
		>
			{array.map((item) => (
				<Select.Item key={item._id} label={item.value} value={item._id} />
			))}
		</Select>
	);
};

export const FDSSelect = React.memo(
	NotMemoizedFDSSelect,
) as typeof NotMemoizedFDSSelect;
