import { Box } from "native-base";
import React from "react"

const height = {
	xsmall: 8,
	small: 12,
	medium: 16,
	large: 20,
	xlarge: 24,
	xxlarge: 28,
};

type sizeType = keyof typeof height;

export const Spacer = ({ size }: { size: sizeType }) => <Box style={{ height: height[size] }} />;
