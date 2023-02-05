import React from "react";
import { VStack } from "native-base";
import { CategoryList } from "./CategoryList";
import { ProductList } from "./ProductList";
import { ModalFeedback } from "../../components/ModalFeedback/ModalFeedback";
import Loading from "../../components/Loading/Loading";
import { useProductMutationHook } from "../../graphQL/ProductQL";
import { useCategoryMutationHook } from "../../graphQL/CategoryQL";
import { useAppStore } from "../UseAppStore";
import { Box } from "native-base";

export default function AddProductCategoriesScreen({ resetAll }: { resetAll: () => void }) {
  const { allCategories, loadingCategory } = useCategoryMutationHook();
  const { allProducts, loadingProduct } = useProductMutationHook();

  const networkStatus = useAppStore((state) => state.networkState);
  const setNetworkState = useAppStore((state) => state.setNetworkState);
  const categoryId = useAppStore((state) => state.category);

  const isSuccess = networkStatus === "success";
  const isError = networkStatus === "error";

  const filteredProducts = allProducts?.filter((product) => {
    if (categoryId) {
      return product?.category?._id === categoryId;
    }
    return product;
  });

  console.log("BUG INTROUDUCED HERE");

  return (
    <Box flex={1}>
      <Box
        backgroundColor={"primary.500"}
        h={150}
        w={"100%"}
        position={"absolute"}
        zIndex={-1}
      />
      <Loading isLoading={loadingProduct || loadingCategory} />

      <ModalFeedback
        isWarning={isError}
        isOpen={isSuccess || isError}
        onClose={() => setNetworkState("idle")}
      />
      <VStack flex={1} p={"4"} space={"4"}>
        <CategoryList resetAll={resetAll} categories={allCategories} />
        {allCategories?.length > 0 ? (
          <ProductList resetAll={resetAll} products={filteredProducts} />
        ) : null}
      </VStack>
    </Box>
  );
}
