import React, { useCallback } from "react"
import AddProductCategoriesScreen from "./AddProductCategoriesScreen";
import * as z from 'zod';
import { useProductMutationHook } from "../../graphQL/ProductQL";
import { useCategoryMutationHook } from "../../graphQL/CategoryQL";
import { useAppStore } from "../UseAppStore";
import { useProductFormHook } from "./useProductFormHook";

export const AddProductsCategories = () => {

  const categoryId = useAppStore(state => state.category)

  const { createProduct,
    resetCreateProduct,
    resetDeleteProduct,
    resetUpdateProduct,
    updateProduct } = useProductMutationHook()

  const { createCategory,
    updateCategory,
    resetCreateCategories,
    resetUpdateCategory,
    resetDeleteCategory } = useCategoryMutationHook()


  // the form should be inside ProductsList


  const resetAll = useCallback(() => {
    // reset all Categories call from GraphQL
    resetCreateCategories();
    resetDeleteCategory()
    resetUpdateCategory();

    // Reset all Products call from GraphQl
    resetCreateProduct();
    resetDeleteProduct()
    resetUpdateProduct()


  }, [resetCreateCategories, resetCreateProduct, resetDeleteCategory, resetDeleteProduct, resetUpdateCategory, resetUpdateProduct])

  return (
    <AddProductCategoriesScreen
      resetAll={resetAll}
    />
  )
}