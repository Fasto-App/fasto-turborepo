import React from 'react';
import { Box, Pressable, Text } from 'native-base';

type CategoryTileProps = {
	category: any,
	onPress: () => void,
	selected: boolean
};


const CategoryTile = ({ category, onPress, selected }: CategoryTileProps) => {
	const color = selected ? "primary.500" : "black"

	return (
		<Pressable onPress={onPress}>

			<Box mr={4} w={200} h={"75px"} borderRadius={'lg'} borderColor={color} borderWidth={"1"} justifyContent={"center"}>

				<Text
					fontSize={"lg"}
					textAlign={'center'}
					color={selected ? "primary.500" : "black"}
				>{category.name}</Text>
			</Box>
		</Pressable>
	);
};


export { CategoryTile };
