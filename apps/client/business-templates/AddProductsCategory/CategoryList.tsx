import React, { useCallback, useState } from 'react';
import {
	Box, Heading, Text, FlatList, HStack, VStack
} from 'native-base';
import { AddMoreButton, SmallAddMoreButton } from '../../components/atoms/AddMoreButton';
import { useAppStore } from '../UseAppStore';
import { AllAndEditButtons } from '../../components/AllAndAddButons';
import { useCategoryFormHook } from './useCategoryFormHook';
import { CategoryModal } from './CategoryModal';
import { GetAllCategoriesByBusinessQuery } from '../../gen/generated';
import { useTranslation } from 'react-i18next';
import { Tile } from '../../components/Tile';

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
					<AllAndEditButtons
						categoryId={categoryId}
						allAction={clearQueryParams}
						editAction={() => setShowCategoryModal(true)}
					/>
				</HStack>
			</Box>

			<HStack space={2}>
				{categories.length ?
					<SmallAddMoreButton onPress={() => {
						removeQueryParams()
						setShowCategoryModal(true)
					}} />
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
