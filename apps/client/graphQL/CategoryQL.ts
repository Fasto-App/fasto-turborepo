import { useAppStore } from "../business-templates/UseAppStore";
import {
  GetAllCategoriesByBusinessDocument,
  GetAllProductsByBusinessIdDocument,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesByBusinessQuery,
  useUpdateCategoryMutation
} from "../gen/generated";

export const useCategoryMutationHook = () => {
  const setNetworkState = useAppStore(state => state.setNetworkState)

  const { data: allCategories,
    loading: getCategoriesIsLoading
  } = useGetAllCategoriesByBusinessQuery();

  const [createCategory, {
    data: categoryCreated,
    loading: createCategoryIsLoading,
    error: isCategoryError,
    reset: resetCreateCategories
  }] = useCreateCategoryMutation({
    onCompleted: (data) => {
      setNetworkState("success")
    },
    onError: (error) => {
      setNetworkState("error")
    },
    update: (cache, { data: { createCategory } }) => {
      // @ts-ignore
      const { getAllCategoriesByBusiness } = cache.readQuery({
        query: GetAllCategoriesByBusinessDocument
      });

      cache.writeQuery({
        query: GetAllCategoriesByBusinessDocument,
        data: {
          getAllCategoriesByBusiness: [createCategory, ...getAllCategoriesByBusiness]
        }
      });
    }
  });

  const [updateCategory, {
    reset: resetUpdateCategory,
    data: categoryUpdated,
    error: isCategoryUpdatedError,
  }] =
    useUpdateCategoryMutation({
      onCompleted: (data) => {
        setNetworkState("success")
      },
      onError: (error) => {
        setNetworkState("error")
      },
      update: (cache, { data: { updateCategory } }) => {
        // @ts-ignore
        const { getAllCategoriesByBusiness } = cache.readQuery({
          query: GetAllCategoriesByBusinessDocument
        });

        cache.writeQuery({
          query: GetAllCategoriesByBusinessDocument,
          data: {
            getAllCategoriesByBusiness: getAllCategoriesByBusiness.map(category => {
              if (category._id === updateCategory._id) {
                return updateCategory;
              }
              return category;
            })
          }
        });
      }
    });

  const [deleteCategory, {
    data: categoryDeleted,
    reset: resetDeleteCategory
  }] = useDeleteCategoryMutation({
    onCompleted: (data) => {
      setNetworkState("success")
    },
    onError: (error) => {
      setNetworkState("error")
    },
    refetchQueries: [GetAllCategoriesByBusinessDocument, GetAllProductsByBusinessIdDocument]
  });

  return {
    allCategories: (allCategories?.getAllCategoriesByBusiness || []),
    createCategory,
    categoryUpdated: categoryUpdated?.updateCategory,
    categoryDeleted,
    createCategoryIsLoading,
    deleteCategory,
    isCategoryUpdatedError,
    categoryError: isCategoryError?.message,
    getCategoriesIsLoading,
    loadingCategory: createCategoryIsLoading || getCategoriesIsLoading,
    categoryCreated,
    resetDeleteCategory,
    resetCreateCategories,
    resetUpdateCategory,
    updateCategory,
  }
}