import React, { useCallback, useState } from 'react';
import { GetAllCategoriesByBusinessQuery } from '../../gen/generated';
import { useTranslation } from 'react-i18next';
import { CategoryModal } from '@/src/business-templates/AddProductsCategory/CategoryModal';
import { useCategoryFormHook } from '@/src/business-templates/AddProductsCategory/useCategoryFormHook';
import { Tile } from '@/src/components/Tile';
import { SmallAddMoreButton } from '@/src/components/atoms/AddMoreButton';
import { useAppStore } from '@/src/business-templates/UseAppStore';
import Box from 'native-base/lib/typescript/components/primitives/Box';
import Heading from 'native-base/lib/typescript/components/primitives/Heading';
import { Button } from 'native-base/lib/typescript/components/primitives/Button';
import HStack from 'native-base/lib/typescript/components/primitives/Stack/HStack';
import { FlatList } from 'native-base/lib/typescript/components/basic/FlatList/FlatList';
import VStack from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import Text from 'native-base/lib/typescript/components/primitives/Text';

type Categories = NonNullable<GetAllCategoriesByBusinessQuery["getAllCategoriesByBusiness"]>

const CategoryList = ({ resetAll, categories }:
	{ resetAll: () => void, categories: Categories }) => {
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const setCategory = useAppStore(state => state.setCategory)
	const categoryId = useAppStore(state => state.category)

	const { t } = useTranslation("businessCategoriesProducts")

	const clearQueryParams = () => {
		setCategory(null)
		resetAll()
	}

	const {
		categoryControl,
		categoryFormState,
		handleCategorySubmit,
		setCategoryValue,
		resetCategoryForm,
	} = useCategoryFormHook()

	const removeQueryParams = useCallback(() => {
		setCategory(null)
		setCategoryValue("_id", "")
		setCategoryValue("categoryName", "")
	}, [setCategory, setCategoryValue])

	const addQueryParams = useCallback((id, categoryName, categoryDescription) => {
		setCategory(id)
		setCategoryValue("_id", id)
		setCategoryValue("categoryName", categoryName)

	}, [setCategory, setCategoryValue])

	// cada list vai saber que all clicar nele, um modal eh aberto e ele esta pornto para ser editado
	// so precisamos do id do modal
	const renderCategory = useCallback(({ item }: { item: Categories[number], index: number }) => {
		if (!item) return null

		return (
			<Tile
				key={item._id}
				selected={categoryId === item._id}
				onPress={() => {
					addQueryParams(item._id, item.name, item.description)
				}}
			>
				{item.name}
			</Tile>
		)
	}, [addQueryParams, categoryId])

	const EmptyState = () => {
		return (
			<Box>
				<SmallAddMoreButton
					onPress={() => setShowCategoryModal(true)}
				/>
				<Text pt={3} fontSize={"xl"}>{t("emptyListText")}</Text>
			</Box>
		)
	}

	return (<>
		<VStack
			space={4}
			p={"4"}
			shadow={"4"}
			borderWidth={1}
			borderRadius={"md"}
			borderColor={"trueGray.400"}
			backgroundColor={"white"}
		>
			<Box flexDirection={"row"}>
				<Heading flex={1}>
					{t("categories")}
				</Heading>
				<HStack>
					<Button
						disabled={!categoryId}
						isDisabled={!categoryId}
						variant={"solid"}
						width={"100px"}
						colorScheme="success"
						onPress={() => setShowCategoryModal(true)}>
						{t("edit")}
					</Button>
				</HStack>
			</Box>

			<HStack space={2}>
				{categories.length ?
					<>
						<SmallAddMoreButton onPress={() => {
							removeQueryParams()
							setShowCategoryModal(true)
						}} />
						<Tile
							selected={!categoryId}
							onPress={clearQueryParams}
						>
							{t("all")}
						</Tile>
					</>
					: null}
				<HStack flex={1} space={1}>
					<FlatList
						horizontal
						data={categories.length ? categories : []}
						renderItem={renderCategory}
						ListEmptyComponent={EmptyState}
						ItemSeparatorComponent={() => <Box w={"2"} />}
						keyExtractor={(item) => `${item?._id}_category`}
					/>
				</HStack>
			</HStack>
		</VStack>
		<CategoryModal
			// @ts-ignore
			categoryControl={categoryControl}
			showModal={showCategoryModal}
			setShowModal={setShowCategoryModal}
			categoryFormState={categoryFormState}
			handleCategorySubmit={handleCategorySubmit}
			resetCategoryForm={resetCategoryForm}
		/>

	</>
	);
};





export { CategoryList };
