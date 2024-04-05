import React, { useCallback, useMemo, useState } from 'react';
import {
	Box, Heading, Link, Text, FlatList, HStack, Badge
} from 'native-base';
import { ProductCard, ProductTile } from '../../components/Product/Product';
import { ProductModal } from './ProductModal';
import { useNumOfColumns } from '../../hooks';
import { useAppStore } from '../UseAppStore';
import { useCategoryMutationHook } from '../../graphQL/CategoryQL';
import { useProductFormHook } from './useProductFormHook';
import { GetAllProductsByBusinessIdQuery } from '../../gen/generated';
import { useTranslation } from 'next-i18next';
import { MoreButton } from '../../components/MoreButton';
import { PlusButton } from '../Tables/SquareTable';
import { parseToCurrency } from 'app-helpers';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '@/shadcn/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';

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
		resetProduct,
		getProductValues
	} = useProductFormHook()

	const { t } = useTranslation("businessCategoriesProducts");

	const setProductValues = useCallback((item) => {
		const { _id, name, description, price, imageUrl, quantity, paused } = item

		setProduct(_id)
		setProductValue("_id", _id)
		setProductValue("name", name)
		setProductValue("description", description)
		setProductValue("price", price)
		setProductValue("file", imageUrl)
		setProductValue("category", item?.category?._id)
		setProductValue("quantity", quantity)
		setProductValue("paused", paused)

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
			paused={item?.paused}
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
			getProductValues={getProductValues}
		/>
		<div
			className="flex flex-1 p-4 w-full shadow-md border-1 rounded-md border-trueGray-400 bg-white flex-col overflow-y-auto"
		>
			<div className="flex justify-between items-center">
				<div className="flex space-x-2 items-center text-xl font-bold">
					<p className="flex-1">
						{selectedCategory?.name ?? t("all")}
					</p>
					{products?.length ? <Button className='bg-white text-black' size="icon" onClick={addProduct}><PlusIcon/></Button> : null}
				</div>

				{products?.length ?
					<div className="self-end p-4 text-xl">
						<Link
							onPress={() => setShowTileList(!showTilesList)}
							_text={{ color: "blue.400" }}
						>
							{showTilesList ? t("showCards") : t("showList")}
						</Link>
					</div>
					:
					null}
			</div>
			<div className='overflow-y-auto mt-4 sm:mt-0'>
			<div className="flex flex-row flex-wrap justify-center sm:justify-start">
				{!products.length ?
					<div className='pt-4'>
						<PlusButton onPress={() => setShowProductModal(true)} />
					</div> : null}
				{showTilesList ?
				<>
					{products.map(item => (
						!item ? null :
							<ProductTile
								quantity={item?.quantity || undefined}
								name={item.name}
								description={item.description ?? ""}
								imageUrl={item.imageUrl ?? ""}
								onPress={() => setProductValues(item)}
								key={item._id}
								ctaTitle={t("editItem")}
								paused={item?.paused}
							/>
					))}
					{/* <FlatList
						key={numColumns}
						data={products}
						numColumns={numColumns}
						renderItem={renderProductTile}
						keyExtractor={(item) => `${item?._id}_product`}
						ItemSeparatorComponent={() => <div className='h-4' />}
						overflowX="hidden"
					/> */}
				</>
					:
					products.map(item => (
						!item ? null :
							<ProductCard
								quantity={item?.quantity || undefined}
								name={item.name}
								description={item.description ?? ""}
								price={parseToCurrency(item.price, item.currency)}
								imageUrl={item.imageUrl ?? ""}
								onPress={() => setProductValues(item)}
								key={item._id}
								ctaTitle={t("editItem")}
								paused={item?.paused}
							/>
					))}
			</div>
			</div>
		</div>
	</>

	);
};



export { ProductList };
