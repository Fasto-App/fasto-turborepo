import { showToast } from "../components/showToast";
import {
  useGetAllProductsByBusinessIdQuery,
  useCreateProductMutation,
  GetAllProductsByBusinessIdDocument,
  useDeleteProductMutation,
  useUpdateProductByIdMutation
} from "../gen/generated";


export const useProductMutationHook = (useAddProductButton = false) => {
  // READ
  const {
    data: allProducts,
    loading: getProductsIsLoading
  } = useGetAllProductsByBusinessIdQuery();



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
        message: "Product created successfully",
      })

    },
    onError: (error) => {
      showToast({
        status: "error",
        message: "There was an error creating the product",
      })
    },
    refetchQueries: [GetAllProductsByBusinessIdDocument]
  });


  const [deleteProduct, {
    data: productDeleted,
    reset: resetDeleteProduct,
    loading: deleteProductIsLoading,
  }] = useDeleteProductMutation({
    onCompleted: (data) => {
      showToast({
        message: "Product deleted successfully",
      })
    },
    onError: (error) => {
      showToast({
        status: "error",
        message: "Error deleting the product",
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
      onCompleted: (data) => {
        showToast({
          message: "Product updated successfully",
        })
      },
      onError: (error) => {
        showToast({
          status: "error",
          message: "Error updating the product",
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
