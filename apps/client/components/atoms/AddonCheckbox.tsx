import { Checkbox, HStack, Text } from "native-base";
import React from "react";

type AddonProps = {
	name: string;
	price: string;
	value: string;
	onChange: (value: boolean) => void;
	isDisabled?: boolean;
};

export const Addon = ({
	name,
	price,
	value,
	onChange,
	isDisabled,
}: AddonProps) => {
	return (
		<HStack justifyContent={"space-between"}>
			<HStack>
				<Checkbox
					isDisabled={isDisabled}
					shadow={2}
					value={value}
					onChange={onChange}
					size={"md"}
				>
					{name}
				</Checkbox>
			</HStack>
			<Text alignSelf={"center"}>{price}</Text>
		</HStack>
	);
};
