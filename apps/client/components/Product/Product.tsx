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
import { BorderTile } from '../BorderTile';

type ProductTileProps = {
	onPress?: () => void;
	onCheckboxClick?: (selected: boolean) => void;
	singleButton?: boolean;
	isChecked?: boolean;
	ctaTitle: string;
	name: string;
	imageUrl?: string;
	description?: string | null;
};

type ProductCardProps = ProductTileProps & {
	description?: string;
	price: number;
}

const texts = {
	addToMenu: 'Add to Menu',
	editItem: 'Edit Item',
}

const maxLength = 100;

const IMAGE_PLACEHOLDER = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtmXoCwCBNSm0w3SLD1aWW9m6kpRUoCFp2qmT7i5TTKE_KMRIfZUNReWEyJ6QWtx3Iww&usqp=CAU"

const Price = ({ price }: { price: number }) => (
	<Text fontWeight="400" fontSize={"lg"} mx={"4"}>
		{`$${(price / 100).toFixed(2)}`}
	</Text>)

const ProductCard = ({ name, price, imageUrl, description, onPress, singleButton }: ProductCardProps) => {

	const formattedDescriptions = description && description.length > maxLength ?
		(description.substring(0, maxLength) + "...") : description

	return (
		<Box
			w={"72"}
			rounded="lg"
			overflow="hidden"
			borderColor="coolGray.200"
			backgroundColor="white"
			shadow="4"
			mr={"4"}
			mb={"4"}
		>
			<Box alignItems="center" backgroundColor={"secondary.300"}>
				<AspectRatio w="60%" ratio={16 / 9} top={5}>
					<Image source={{
						uri: imageUrl ? imageUrl : IMAGE_PLACEHOLDER
					}} alt="image" borderRadius={"sm"} />
				</AspectRatio>
			</Box>
			<Stack pt={8} p={2} space={2}>
				<Heading size="md" textAlign={"center"}>
					{name}
				</Heading>
				<Text fontWeight="400" textAlign={"center"}>
					{formattedDescriptions ? formattedDescriptions : "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
				</Text>
				<VStack alignItems="center" space={2} justifyContent="space-between" pb={2}>
					{singleButton ?? <Price price={price} />}
					<HStack alignItems="center" space={2} justifyContent="space-between">
						{singleButton ? <Price price={price} /> : <Button w={"100"}>{texts.addToMenu}</Button>}
						<Button w={"100"} colorScheme="tertiary" onPress={onPress}>{texts.editItem}</Button>
					</HStack>
				</VStack>
			</Stack>
		</Box>)
};

const ProductTile = ({ name, imageUrl, onPress, isChecked, onCheckboxClick, ctaTitle, description }: ProductTileProps) => {

	const formattedDescriptions = description && description.length > maxLength ?
		(description.substring(0, maxLength) + "...") : description

	return <BorderTile width={"96"}>
		<HStack alignItems="center" space={3} flex={1}>
			<Avatar size="48px" source={{
				uri: imageUrl ? imageUrl : IMAGE_PLACEHOLDER
			}} />
			<VStack flex={1}>
				<Text color="coolGray.800" bold>
					{name}
				</Text>
				<Text color="coolGray.600" fontSize={"xs"}>
					{formattedDescriptions ? formattedDescriptions : "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
				</Text>
			</VStack>
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
	</BorderTile>
}


export { ProductCard, ProductTile };
