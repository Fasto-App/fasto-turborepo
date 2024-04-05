import React, { useCallback, useState } from 'react';
import {
	Box, Heading, Text, FlatList, HStack, VStack, Button
} from 'native-base';
import { SmallAddMoreButton } from '../../components/atoms/AddMoreButton';
import { useAppStore } from '../UseAppStore';
import { useCategoryFormHook } from './useCategoryFormHook';
import { CategoryModal } from './CategoryModal';
import { GetAllCategoriesByBusinessQuery } from '../../gen/generated';
import { useTranslation } from 'react-i18next';
import { Tile } from '../../components/Tile';
import { Card } from '@/shadcn/components/ui/card';
import { ScrollArea, ScrollBar } from '@/shadcn/components/ui/scroll-area';
import { PlusIcon } from '@radix-ui/react-icons';

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
		<div className="space-y-4 p-4 shadow-md border border-gray-400 rounded-md bg-white mt-[36px] sm:mt-0">
			<div className='flex flex-row justify-between items-center'>
				<p className='text-xl font-bold'>
					{t("categories")}
				</p>
				<div>
					<Button
						disabled={!categoryId}
						isDisabled={!categoryId}
						variant={"solid"}
						width={"100px"}
						colorScheme="success"
						onPress={() => setShowCategoryModal(true)}>
						{t("edit")}
					</Button>
				</div>
			</div>
			<div className="flex space-x-2">
				{categories.length ? (
					<>
						<Button variant="outline" onPress={() => {
							removeQueryParams()
							setShowCategoryModal(true)
						}}><PlusIcon/></Button>						
						<Tile
							selected={!categoryId}
							onPress={clearQueryParams}
						>
							{t("all")}
						</Tile>
					</>
				) : null}
				<div className="flex flex-1 space-x-1 overflow-x-auto">
						<FlatList
							horizontal
							data={categories.length ? categories : []}
							renderItem={renderCategory}
							ListEmptyComponent={EmptyState}
							ItemSeparatorComponent={() => <Box w={"2"} />}
							keyExtractor={(item) => `${item?._id}_category`}
						/>
				</div>
			</div>
		</div>
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
