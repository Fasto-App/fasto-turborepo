import { useAppStore } from "../business-templates/UseAppStore";
import {
  useGetAllProductsByBusinessIdQuery,
  useCreateProductMutation,
  GetAllProductsByBusinessIdDocument,
  useDeleteProductMutation,
  useUpdateProductByIdMutation
} from "../gen/generated";


export const useProductMutationHook = (useAddProductButton = false) => {
  const setNetworkState = useAppStore(state => state.setNetworkState)

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
      setNetworkState("success")

    },
    onError: (error) => {
      setNetworkState("error")
    },
    refetchQueries: [GetAllProductsByBusinessIdDocument]
  });


  const [deleteProduct, {
    data: productDeleted,
    reset: resetDeleteProduct
  }] = useDeleteProductMutation({
    onCompleted: (data) => {
      setNetworkState("success")
    },
    onError: (error) => {
      setNetworkState("error")
    },
    refetchQueries: [GetAllProductsByBusinessIdDocument]
  });

  // MARK UPDATE
  const [updateProduct,
    { reset: resetUpdateProduct,
      data: productUpdated, }] =
    useUpdateProductByIdMutation({
      onCompleted: (data) => {
        setNetworkState("success")
      },
      onError: (error) => {
        setNetworkState("error")
      },
      refetchQueries: [GetAllProductsByBusinessIdDocument]
    });

  return {
    allProducts: allProducts?.getAllProductsByBusinessID.length ? allProducts.getAllProductsByBusinessID : [],
    createProduct,
    createProductIsLoading,
    deleteProduct,
    loadingProduct: createProductIsLoading || getProductsIsLoading,
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
