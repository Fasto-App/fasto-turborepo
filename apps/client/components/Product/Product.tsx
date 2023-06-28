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
import { useTranslation } from 'next-i18next';

type ProductTileProps = {
	_id?: string;
	onPress?: () => void;
	singleButton?: boolean;
	ctaTitle: string;
	name: string;
	imageUrl?: string;
	description?: string | null;
};

type ProductCardProps = ProductTileProps & {
	description?: string;
	price: number;
}

type ProductTileWithCheckboxProps = ProductTileProps & {
	isChecked: boolean;
	onCheck: (selected: boolean) => void;
}

const maxLength = 120;

const IMAGE_PLACEHOLDER = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtmXoCwCBNSm0w3SLD1aWW9m6kpRUoCFp2qmT7i5TTKE_KMRIfZUNReWEyJ6QWtx3Iww&usqp=CAU"

const Price = ({ price }: { price: number }) => (
	<Text fontWeight="400" fontSize={"lg"} mx={"4"}>
		{`$${(price / 100).toFixed(2)}`}
	</Text>)

const ProductCard = ({ name, price, imageUrl, description, onPress, singleButton }: ProductCardProps) => {
	const { t } = useTranslation("common");

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
			<Stack pt={8} p={2} space={2} flex={1}>
				<Heading size="md" textAlign={"center"}>
					{name}
				</Heading>
				<Text fontWeight="400" textAlign={"center"} flex={1}>
					{formattedDescriptions}
				</Text>
				<VStack alignItems="center" space={2} justifyContent="space-between" pb={2}>
					{singleButton ?? <Price price={price} />}
					<HStack alignItems="center" space={2} justifyContent="space-between">
						<Button w={"100"} colorScheme="tertiary" onPress={onPress}>{t("edit")}</Button>
					</HStack>
				</VStack>
			</Stack>
		</Box>)
};

// create a new component that accepts the same props as ProductTile
const ProductTile = ({ name, imageUrl, onPress, ctaTitle, description }: ProductTileProps) => {
	const { t } = useTranslation("common");

	const formattedDescriptions = description && description.length > maxLength ?
		(description.substring(0, maxLength) + "...") : description

	return <BorderTile width={"96"}>
		<HStack alignItems="center" space={3} flex={1}>
			<Avatar size="48px" source={{
				uri: imageUrl ? imageUrl : IMAGE_PLACEHOLDER
			}} />
			<VStack flex={1} h={"100%"} justifyContent={"space-between"}>
				<Text color="coolGray.800" bold>
					{name}
				</Text>
				{formattedDescriptions ? <Text color="coolGray.600" fontSize={"xs"}>
					{formattedDescriptions}
				</Text> : null}
			</VStack>
			<HStack alignItems="center" space={2} justifyContent="space-between" py={4}>
				<Button w={"100"} colorScheme="tertiary"
					onPress={onPress}>{ctaTitle}
				</Button>
			</HStack>
		</HStack>
	</BorderTile>
}

const ProductTileWithCheckbox = (
	{ name, imageUrl, description, _id, isChecked, onCheck }: ProductTileWithCheckboxProps) => {
	const { t } = useTranslation("common");

	const formattedDescriptions = description && description.length > maxLength ?
		(description.substring(0, maxLength) + "...") : description

	return (
		<BorderTile width={"96"}>
			<HStack alignItems="center" space={3} flex={1}>
				<Avatar size="48px" source={{ uri: imageUrl ? imageUrl : IMAGE_PLACEHOLDER }} />

				<VStack flex={1} h={"100%"} justifyContent={"space-between"}>
					<Text color="coolGray.800" bold>
						{name}
					</Text>
					{formattedDescriptions ? <Text color="coolGray.600" fontSize={"xs"}>
						{formattedDescriptions}
					</Text> : null}
					<Box
						flex={1}
						justifyContent={"flex-end"}
						pt={2}
					>
						<Checkbox
							alignContent={"flex-end"}
							value={_id ?? name}
							my="1"
							isChecked={isChecked}
							onChange={onCheck}
						>
							{t("addToMenu")}
						</Checkbox>
					</Box>
				</VStack>
			</HStack>
		</BorderTile>
	)
}


export { ProductCard, ProductTile, ProductTileWithCheckbox };
