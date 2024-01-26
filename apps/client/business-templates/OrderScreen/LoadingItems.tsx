import React from "react";
import { Box, Skeleton } from "native-base";

export const LoadingItems = () => {
	return (
		<Box>
			{new Array(10).fill({}).map((_, i) => (
				<Skeleton
					key={i}
					p={1}
					height={"16"}
					borderRadius={"md"}
					startColor={i % 2 === 0 ? "secondary.100" : "gray.100"}
				/>
			))}
		</Box>
	);
};
