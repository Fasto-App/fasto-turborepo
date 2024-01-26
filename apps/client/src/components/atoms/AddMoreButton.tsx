import React from "react";
import { Box, Button, Pressable, Text } from "native-base";
import { AiOutlinePlus } from "react-icons/ai";

type AddMoreButtonProps = {
	onPress: () => void;
	empty?: boolean;
	horizontal?: boolean;
	widthProps?: number | string;
	small?: boolean;
};

const AddMoreButton = ({
	onPress,
	empty = false,
	horizontal = false,
	widthProps,
	small,
}: AddMoreButtonProps) => {
	const width = widthProps ? widthProps : horizontal ? "80" : "280px";
	const height = horizontal ? "75px" : "300px";

	const innerWidth = horizontal ? "100%" : "120px";
	const innerHeight = horizontal ? "100%" : "120px";

	return (
		<Pressable onPress={onPress}>
			<Box
				w={width}
				h={height}
				justifyContent={"center"}
				alignItems={empty ? "" : "center"}
				mr={"4"}
			>
				<Box
					w={innerWidth}
					h={innerHeight}
					borderRadius={"lg"}
					borderColor={"trueGray.300"}
					borderWidth={"1"}
					justifyContent={"center"}
					alignItems={"center"}
				>
					<Box borderWidth={1} borderRadius={"full"} p={"2"}>
						<AiOutlinePlus size={horizontal ? "2em" : "3em"} />
					</Box>
				</Box>
			</Box>
		</Pressable>
	);
};

export const SmallAddMoreButton = ({ onPress }: { onPress: () => void }) => {
	return (
		<Button
			maxH={"40px"}
			borderWidth={1}
			colorScheme="primary"
			variant={"outline"}
			onPress={onPress}
			w={"100px"}
		>
			<Box
				borderWidth={1}
				borderRadius={"full"}
				justifyContent="center"
				alignItems={"center"}
			>
				<AiOutlinePlus size={"1em"} />
			</Box>
		</Button>
	);
};

export { AddMoreButton };
