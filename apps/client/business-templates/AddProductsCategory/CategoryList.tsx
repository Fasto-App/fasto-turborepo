import React, { useCallback, useState } from 'react';
import {
	Button, Box, Heading, Text, FlatList, HStack
} from 'native-base';
import { AddMoreButton } from '../../components/atoms/AddMoreButton';
// import { CategoryModal } from './CategoryModal';
import { CategoryTile } from '../../components/Category/Category';
import { Category } from '../../components/Category/types';
import { useAppStore } from '../UseAppStore';
import { AllAndEditButtons } from '../AllAndAddButons';
import { useCategoryFormHook } from './useCategoryFormHook';
import { CategoryModal } from './CategoryModal';
import { GetAllCategoriesByBusinessQuery } from '../../gen/generated';


const texts = {
	title: "Categories",
	showList: "Show List",
	showCards: "Show Cards",
	edit: "Edit",
	emptyListText: "Start adding Categories by clicking in the button above.",
}

type Categories = NonNullable<GetAllCategoriesByBusinessQuery["getAllCategoriesByBusiness"]>

const CategoryList = ({ resetAll, categories }:
	{ resetAll: () => void, categories: Categories }) => {
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const setCategory = useAppStore(state => state.setCategory)
	const categoryId = useAppStore(state => state.category)

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
			<CategoryTile
				category={{ name: item.name, id: item._id }}
				selected={categoryId === item._id}
				onPress={() => {
					// set the id of the category in the state.
					addQueryParams(item._id, item.name, item.description)
				}}
			/>
		)
	}, [addQueryParams, categoryId])

	const EmptyState = () => {
		return (
			<Box py={3} >
				<AddMoreButton
					widthProps={200}
					horizontal
					onPress={() => setShowCategoryModal(true)}
				/>
				<Text pt={3} fontSize={"xl"}>{texts.emptyListText}</Text>
			</Box>
		)
	}

	return (
		<Box
			p={"4"}
			w={"100%"}
			shadow={"4"}
			borderWidth={1}
			borderRadius={"md"}
			borderColor={"trueGray.400"}
			backgroundColor={"white"}
			flexDirection={"column"}
		>

			{/* Header */}
			<Box flexDirection={"row"}>
				{/* Title */}
				<Heading flex={1}>
					{texts.title}
				</Heading>
			</Box>

			<Box>
				<Box flexDirection={"row"} width={"100%"} flex={1} mb={2} p={'1'}>
					{categories.length ? <AddMoreButton
						widthProps={200}
						horizontal
						onPress={() => {
							removeQueryParams()
							setShowCategoryModal(true)
						}}
					/> : null}
					<HStack flex={1} space={1}>
						<FlatList
							horizontal
							data={categories.length ? categories : []}
							renderItem={renderCategory}
							ListEmptyComponent={EmptyState}
							keyExtractor={(item) => `${item?._id}_category`}
						/>
					</HStack>
				</Box>

				<HStack>
					<AllAndEditButtons
						categoryId={categoryId}
						allAction={clearQueryParams}
						editAction={() => setShowCategoryModal(true)}
					/>
				</HStack>
			</Box>

			<CategoryModal
				// @ts-ignore
				categoryControl={categoryControl}
				showModal={showCategoryModal}
				setShowModal={setShowCategoryModal}
				categoryFormState={categoryFormState}
				handleCategorySubmit={handleCategorySubmit}
				resetCategoryForm={resetCategoryForm}
			/>
		</Box>
	);
};





export { CategoryList };
