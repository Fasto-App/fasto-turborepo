import React, { useCallback, useMemo, useState } from 'react';
import {
	Box, Heading, Link, Text, FlatList, HStack
} from 'native-base';
import { ProductCard, ProductTile } from '../../components/Product/Product';
import { AddMoreButton } from '../../components/atoms/AddMoreButton';
import { ProductModal } from './ProductModal';
import type { Product } from '../../components/Product/types';
import { useNumOfColumns } from '../../hooks';
import { Control, FormState } from 'react-hook-form';
import { useAppStore } from '../UseAppStore';
import { useCategoryMutationHook } from '../../graphQL/CategoryQL';
import { useProductFormHook } from './useProductFormHook';


const texts = {
	all: "All",
	editItem: "Edit Item",
	showList: "Show List",
	showCards: "Show Cards",
	emptyListText: "Start adding dishes by clicking in the button below.",
}


const ProductList = (
	{ products,
		resetAll,
	}) => {
	const [showProductModal, setShowProductModal] = useState(false);
	const [showTilesList, setShowTileList] = useState(false);

	const setProduct = useAppStore(state => state.setProduct)
	const category = useAppStore(state => state.category)
	const { allCategories } = useCategoryMutationHook()

	const selectedCategory = useMemo(() => {
		return allCategories.find(cat => cat._id === category)
	}, [allCategories, category])

	const {
		setProductValue,
		handleProductSubmit,
		productFormState,
		productControl,
		resetProduct
	} = useProductFormHook()

	const setProductValues = useCallback((item) => {
		const { _id, name, description, price, imageUrl } = item

		setProduct(_id)
		setProductValue("_id", _id)
		setProductValue("name", name)
		setProductValue("description", description)
		setProductValue("price", price)
		setProductValue("file", imageUrl)
		setProductValue("category", item?.category?._id)

		setShowProductModal(true)

	}, [setProduct, setProductValue])

	const numColumns = useNumOfColumns(showTilesList)

	const addProduct = useCallback(() => {
		setProductValue("category", category ?? "")
		setShowProductModal(true)
	}, [category, setProductValue])

	const renderProductCard = useCallback((item: Product, index: number) => {
		if (index === 0) return <AddMoreButton key={"AddMoreButton"} onPress={addProduct} />
		return <ProductCard product={item} onPress={() => setProductValues(item)} key={item._id} ctaTitle={texts.editItem} />
	}, [addProduct, setProductValues])

	const renderProductTile = useCallback(({ item, index }: { item: Product, index: number }) => {
		if (index === 0) return <AddMoreButton horizontal onPress={addProduct} />
		return <ProductTile product={item} onPress={() => setProductValues(item)} ctaTitle={texts.editItem} />
	}, [addProduct, setProductValues])

	const EmptyState = () => {
		return (
			<Box>
				<Text fontSize={"xl"}>{texts.emptyListText}</Text>
				<AddMoreButton
					empty
					onPress={() => setShowProductModal(true)}
				/>
			</Box>
		)
	}


	const productsWithButton = useMemo(() => [{ name: "Button" } as Product, ...products], [products])

	const renderListTile = useCallback(() => {
		return (
			<>
				{showTilesList ?
					<FlatList
						key={numColumns}
						data={productsWithButton}
						numColumns={numColumns}
						renderItem={renderProductTile}
						keyExtractor={(item) => item._id}
						ListEmptyComponent={EmptyState}
						ItemSeparatorComponent={() => <Box height={"4"} />}
					/>
					:
					null}
			</>
		)
	}, [numColumns, productsWithButton, renderProductTile, showTilesList])

	const renderListCard = useCallback(() => {
		if (showTilesList) return null

		return productsWithButton.map(renderProductCard)
	}, [productsWithButton, renderProductCard, showTilesList])


	return (<>
		<ProductModal
			resetAll={resetAll}
			showModal={showProductModal}
			setShowModal={setShowProductModal}
			handleProductSubmit={handleProductSubmit}
			productFormState={productFormState}
			productControl={productControl}
			resetProduct={resetProduct}
			setProductValue={setProductValue}
		/>
		<Box
			flex={"1 1 1px"}
			p={"4"}
			w={"100%"}
			shadow={"4"}
			borderWidth={1}
			borderRadius={"md"}
			borderColor={"trueGray.400"}
			backgroundColor={"white"}
			flexDirection={"column"}
			overflow={"scroll"}
		>

			{/* Header */}
			<Box flexDirection={"column"}>
				{/* Title */}
				<Heading flex={1}>
					{selectedCategory?.name ?? texts.all}
				</Heading>

				{/* Toggle */}
				{products?.length ?
					<Link isUnderlined={false} alignSelf={"self-end"} p={4}
						_text={{
							color: "blue.400"
						}} onPress={() => setShowTileList(!showTilesList)}>
						{showTilesList ? texts.showCards : texts.showList}
					</Link> :
					null}
			</Box>


			<HStack
				flexDir={"row"}
				flexWrap={"wrap"}
				overflow={"scroll"}
				space={4}
				minHeight={"0"}
			>
				{renderListTile()}
				{renderListCard()}
			</HStack>
		</Box>
	</>

	);
};



export { ProductList };
