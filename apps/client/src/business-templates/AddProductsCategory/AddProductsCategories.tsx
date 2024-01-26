import React, { useCallback } from "react";
import AddProductCategoriesScreen from "./AddProductCategoriesScreen";
import { useProductMutationHook } from "../../graphQL/ProductQL";
import { useCategoryMutationHook } from "../../graphQL/CategoryQL";

export const AddProductsCategories = () => {
	const { resetCreateProduct, resetDeleteProduct, resetUpdateProduct } =
		useProductMutationHook();

	const { resetCreateCategories, resetUpdateCategory, resetDeleteCategory } =
		useCategoryMutationHook();

	// the form should be inside ProductsList

	const resetAll = useCallback(() => {
		// reset all Categories call from GraphQL
		resetCreateCategories();
		resetDeleteCategory();
		resetUpdateCategory();

		// Reset all Products call from GraphQl
		resetCreateProduct();
		resetDeleteProduct();
		resetUpdateProduct();
	}, [
		resetCreateCategories,
		resetCreateProduct,
		resetDeleteCategory,
		resetDeleteProduct,
		resetUpdateCategory,
		resetUpdateProduct,
	]);

	return <AddProductCategoriesScreen resetAll={resetAll} />;
};
