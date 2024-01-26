import React from "react";
import { VStack } from "native-base";
import { CategoryList } from "./CategoryList";
import { ProductList } from "./ProductList";
import { Loading } from "../../components/Loading";
import { useProductMutationHook } from "../../graphQL/ProductQL";
import { useCategoryMutationHook } from "../../graphQL/CategoryQL";
import { useAppStore } from "../UseAppStore";
import { Box } from "native-base";
import { OrangeBox } from "../../components/OrangeBox";

export default function AddProductCategoriesScreen({
	resetAll,
}: {
	resetAll: () => void;
}) {
	const { allCategories, loadingCategory } = useCategoryMutationHook();
	const { allProducts, loadingProduct } = useProductMutationHook();
	const categoryId = useAppStore((state) => state.category);

	const filteredProducts = allProducts?.filter((product) =>
		categoryId ? product?.category?._id === categoryId : true,
	);

	return (
		<Box flex={1}>
			<OrangeBox />
			<Loading isLoading={loadingProduct || loadingCategory} />
			<VStack flex={1} p={"4"} space={"4"}>
				<CategoryList resetAll={resetAll} categories={allCategories} />
				{allCategories?.length > 0 ? (
					<ProductList resetAll={resetAll} products={filteredProducts} />
				) : null}
			</VStack>
		</Box>
	);
}
