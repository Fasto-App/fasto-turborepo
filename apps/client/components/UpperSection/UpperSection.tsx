import { VStack } from "native-base";
import React, { PropsWithChildren } from "react";

export const UpperSection = ({ children }: PropsWithChildren<{}>) => {
	return (
		<VStack
			p={"4"}
			space={4}
			shadow={"4"}
			borderWidth={1}
			borderRadius={"md"}
			borderColor={"trueGray.400"}
			backgroundColor={"white"}
			flexDirection={"column"}
		>
			{children}
		</VStack>
	);
};
