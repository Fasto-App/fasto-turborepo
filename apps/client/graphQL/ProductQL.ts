import { showToast } from "../components/showToast";
import { useTranslation } from "next-i18next";
import {
  useGetAllProductsByBusinessIdQuery,
  useCreateProductMutation,
  GetAllProductsByBusinessIdDocument,
  useDeleteProductMutation,
  useUpdateProductByIdMutation
} from "../gen/generated";


export const useProductMutationHook = () => {
  // READ
  const {
    data: allProducts,
    loading: getProductsIsLoading
  } = useGetAllProductsByBusinessIdQuery();

  const { t } = useTranslation("businessCategoriesProducts");

  const [createProduct,
    {
      data: newlyCreatedProduct,
      loading: createProductIsLoading,
      error: isProductError,
      reset: resetCreateProduct
    }
  ] = useCreateProductMutation({
    onCompleted: (data) => {
      showToast({
        message: t("productCreated")
      })

    },
    onError: () => {
      showToast({
        status: "error",
        message: t("productCreatedError"),
      })
    },
    refetchQueries: [GetAllProductsByBusinessIdDocument]
  });


  const [deleteProduct, {
    data: productDeleted,
    reset: resetDeleteProduct,
    loading: deleteProductIsLoading,
  }] = useDeleteProductMutation({
    onCompleted: () => {
      showToast({
        message: t("productDeleted"),
      })
    },
    onError: () => {
      showToast({
        status: "error",
        message: t("productDeletedError"),
      })
    },
    refetchQueries: [GetAllProductsByBusinessIdDocument]
  });

  // MARK UPDATE
  const [updateProduct,
    { reset: resetUpdateProduct,
      loading: updateProductIsLoading,
      data: productUpdated, }] =
    useUpdateProductByIdMutation({
      onCompleted: () => {
        showToast({
          message: t("productUpdated"),
        })
      },
      onError: () => {
        showToast({
          status: "error",
          message: t("productUpdatedError"),
        })
      },
      refetchQueries: [GetAllProductsByBusinessIdDocument]
    });

  return {
    allProducts: allProducts?.getAllProductsByBusinessID.length ? allProducts.getAllProductsByBusinessID : [],
    createProduct,
    createProductIsLoading,
    deleteProduct,
    loadingProduct: createProductIsLoading || getProductsIsLoading || updateProductIsLoading || deleteProductIsLoading,
    updateProduct,
    productError: isProductError?.message,
    productUpdated,
    productDeleted,
    resetCreateProduct,
    resetDeleteProduct,
    resetUpdateProduct,
    getProductsIsLoading,
    productCreated: newlyCreatedProduct,
    isProductError
  }

}
