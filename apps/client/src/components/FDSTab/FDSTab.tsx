import { typedKeys } from "app-helpers";
import { HStack, Heading, Divider, Pressable } from "native-base";
import React, { Dispatch, SetStateAction } from "react";

export type TabsType = {
	[key: string]: string;
};

type FDSTabProps<T extends TabsType> = {
	tabs: T;
	setSelectedTab: Dispatch<SetStateAction<string>>;
	selectedTab: keyof T;
};

export const FDSTab = <T extends TabsType>({
	setSelectedTab,
	selectedTab,
	tabs,
}: FDSTabProps<T>) => {
	return (
		<HStack justifyContent={"space-around"}>
			{typedKeys(tabs).map((key, index) => {
				return (
					<Pressable
						key={index}
						flex={1}
						onPress={() => setSelectedTab(key as string)}
					>
						<Heading
							size={"sm"}
							textAlign={"center"}
							color={selectedTab === key ? "primary.500" : "gray.400"}
							pb={2}
						>
							{tabs[key]}
						</Heading>
						<Divider bg={"gray.300"} />
					</Pressable>
				);
			})}
		</HStack>
	);
};
