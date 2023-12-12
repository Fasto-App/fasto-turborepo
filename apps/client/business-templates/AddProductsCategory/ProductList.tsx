import React, { useCallback, useMemo, useState } from 'react';
import {
	Box, Heading, Link, Text, FlatList, HStack, Badge
} from 'native-base';
import { ProductCard, ProductTile } from '../../components/Product/Product';
import { AddMoreButton, SmallAddMoreButton } from '../../components/atoms/AddMoreButton';
import { ProductModal } from './ProductModal';
import { useNumOfColumns } from '../../hooks';
import { useAppStore } from '../UseAppStore';
import { useCategoryMutationHook } from '../../graphQL/CategoryQL';
import { useProductFormHook } from './useProductFormHook';
import { GetAllProductsByBusinessIdQuery } from '../../gen/generated';
import { useTranslation } from 'next-i18next';
import { MoreButton } from '../../components/MoreButton';
import { PlusButton } from '../Tables/SquareTable';

type Products = GetAllProductsByBusinessIdQuery["getAllProductsByBusinessID"];

const ProductList = (
	{ products,
		resetAll,
	}: {
		products: Products,
		resetAll: () => void,
	}) => {
	const [showProductModal, setShowProductModal] = useState(false);
	const [showTilesList, setShowTileList] = useState(false);

	const setProduct = useAppStore(state => state.setProduct)
	const category = useAppStore(state => state.category)
	const { allCategories } = useCategoryMutationHook()

	const selectedCategory = useMemo(() => {
		return allCategories.find(cat => cat?._id === category)
	}, [allCategories, category])

	const {
		setProductValue,
		handleProductSubmit,
		productFormState,
		productControl,
		resetProduct
	} = useProductFormHook()

	const { t } = useTranslation("businessCategoriesProducts");

	const setProductValues = useCallback((item) => {
		const { _id, name, description, price, imageUrl, quantity } = item

		setProduct(_id)
		setProductValue("_id", _id)
		setProductValue("name", name)
		setProductValue("description", description)
		setProductValue("price", price)
		setProductValue("file", imageUrl)
		setProductValue("category", item?.category?._id)
		setProductValue("quantity", quantity)

		setShowProductModal(true)

	}, [setProduct, setProductValue])

	const numColumns = useNumOfColumns(showTilesList)

	const addProduct = useCallback(() => {
		setProductValue("category", category ?? "")
		setShowProductModal(true)
	}, [category, setProductValue])

	const renderProductTile = useCallback(({ item, index }: { item: Products[number], index: number }) => {
		if (!item) return null

		return <ProductTile
			name={item.name}
			imageUrl={item.imageUrl ?? ""}
			onPress={() => setProductValues(item)}
			description={item.description}
			ctaTitle={t("editItem")}
			quantity={item?.quantity || undefined}
		/>
	}, [setProductValues, t])

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
		>
			<HStack justifyContent={"space-between"}>
				<HStack space={2}>
					<Heading flex={1}>
						{selectedCategory?.name ?? t("all")}
					</Heading>
					{products?.length ? <MoreButton onPress={addProduct} /> : null}
				</HStack>

				{products?.length ?
					<Link isUnderlined={false} alignSelf={"self-end"} p={4}
						onPress={() => setShowTileList(!showTilesList)}
						_text={{ color: "blue.400" }}
					>
						{showTilesList ? t("showCards") : t("showList")}
					</Link> :
					null}
			</HStack>
			<HStack
				flex={1}
				space={4}
				flexWrap={"wrap"}
				overflowY={"scroll"}
			>
				{!products.length ?
					<Box pt={4}>
						<PlusButton
							onPress={() => setShowProductModal(true)}
						/>
					</Box> : null}
				{showTilesList ?
					<FlatList
						key={numColumns}
						data={products}
						numColumns={numColumns}
						renderItem={renderProductTile}
						keyExtractor={(item) => `${item?._id}_product`}
						ItemSeparatorComponent={() => <Box height={"4"} />}
						overflowX={"hidden"}
					/>
					:
					products.map(item => (
						!item ? null :
							<ProductCard
								quantity={item?.quantity || undefined}
								name={item.name}
								description={item.description ?? ""}
								price={item.price}
								imageUrl={item.imageUrl ?? ""}
								onPress={() => setProductValues(item)}
								key={item._id}
								ctaTitle={t("editItem")}
							/>
					))}
			</HStack>
		</Box>
	</>

	);
};



export { ProductList };
