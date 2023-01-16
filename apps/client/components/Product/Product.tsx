import React from 'react';
import {
	Box,
	AspectRatio,
	Stack,
	Heading,
	HStack,
	Button,
	Text, Image,
	Avatar,
	VStack,
	Spacer, Checkbox
} from 'native-base';
import { Product } from './types';

type ProductProps = {
	onPress?: () => void;
	product: Product;
	singleButton?: boolean;
	isChecked?: boolean;
	onCheckboxClick?: (selected: boolean) => void;
	ctaTitle: string;
};

const texts = {
	addToMenu: 'Add to Menu',
	editItem: 'Edit Item',
}

const maxLength = 115;

const Price = ({ price }: { price: number }) => (
	<Text fontWeight="400" fontSize={"lg"} mx={"4"}>
		{`$${(price / 100).toFixed(2)}`}
	</Text>)

const ProductCard = ({ product, onPress, singleButton }: ProductProps) => {
	const { name, price, imageUrl, description } = product

	const formattedDescriptions = description.length > maxLength ?
		(description.substring(0, maxLength) + "...") : description

	return (
		<Box
			w={"280px"}
			h={"320px"}
			rounded="lg"
			overflow="hidden"
			borderColor="coolGray.200"
			backgroundColor="white"
			justifyContent={"space-between"}
			shadow="4"
			mr={"4"}
			mb={"4"}
		>
			<Box alignItems="center" backgroundColor={"secondary.300"}>
				<AspectRatio w="60%" ratio={16 / 9} top={5}>
					<Image source={{
						uri: imageUrl
					}} alt="image" borderRadius={"sm"} />
				</AspectRatio>
			</Box>
			<Stack p="3" space={2}>

				<Heading size="md" textAlign={"center"}>
					{name}
				</Heading>
				<Text fontWeight="400" h={"75"} overflow="hidden" textAlign={"center"}>
					{formattedDescriptions}
				</Text>

				<VStack alignItems="center" space={2} justifyContent="space-between">
					{singleButton ?? <Price price={price} />}
					<HStack alignItems="center" space={2} justifyContent="space-between">
						{singleButton ? <Price price={price} /> : <Button w={"100"}>{texts.addToMenu}</Button>}
						<Button w={"100"} colorScheme="tertiary" onPress={onPress}>{texts.editItem}</Button>
					</HStack>
				</VStack>

			</Stack>
		</Box>)
};

const ProductTile = ({ product, onPress, isChecked, onCheckboxClick, ctaTitle }: ProductProps) => {
	const { name, imageUrl, _id } = product

	return <Box mr={"4"}
		shadow="4"
		w={'80'}
		backgroundColor={"white"}
		justifyContent={"center"}
		p={"1"}
		px={"4"}
		borderRadius={"md"}
		mb={4}
	>

		<HStack alignItems="center" space={3}>
			<Avatar size="48px" source={{
				uri: imageUrl
			}} />
			<VStack>
				<Text color="coolGray.800" _dark={{
					color: 'warmGray.50'
				}} bold>
					{name}
				</Text>
			</VStack>
			<Spacer />


			<HStack alignItems="center" space={2} justifyContent="space-between" py={4}>
				{isChecked !== undefined ?
					<Checkbox
						value="Add to Menu"
						my="1"
						isChecked={isChecked}
						onChange={onCheckboxClick}
					>
						Add to Menu
					</Checkbox>
					:
					<Button w={"100"} colorScheme="tertiary"
						onPress={onPress}>{ctaTitle}
					</Button>
				}
			</HStack>
		</HStack>

	</Box>
}


export { ProductCard, ProductTile };
