import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FlatList,
  Heading,
  HStack,
  Input,
  ScrollView,
  Text,
  useTheme,
  Pressable,
  VStack
} from "native-base";
import {
  ProductCard,
  ProductTileWithCheckbox,
} from "../../components/Product/Product";
import { useNumOfColumns } from "../../hooks";
import { useProductMutationHook } from "../../graphQL/ProductQL";
import { DeleteAlert } from "../../components/DeleteAlert";
import { useAppStore } from "../UseAppStore";
import { BsPencilSquare } from "react-icons/bs";
import { Product } from "./types";
import {
  GetAllMenusByBusinessIdDocument,
  useDeleteMenuMutation,
  useGetAllCategoriesByBusinessQuery,
  useGetAllMenusByBusinessIdQuery,
  useGetBusinessInformationQuery,
  useUpdateMenuMutation,
} from "../../gen/generated";
import { Icon } from "../../components/atoms/NavigationButton";
import { useTranslation } from "next-i18next";
import { showToast } from "../../components/showToast";
import { parseToCurrency } from "app-helpers";
import { useRouter } from "next/router";
import { customerRoute } from "fasto-route";

// Todo: [repeated code] AddToToOrder has the same function
const searchProductsByName = (
  searchString: string,
  products: Product[]
): Product[] => {
  if (!searchString) {
    return products;
  }
  const pattern = new RegExp(searchString, "gi");

  return products.filter((product) => pattern.test(product.name));
};

function MenuProducts() {
  const { favoriteMenus, setFavoriteMenus } = useAppStore((state) => ({
    favoriteMenus: state.favoriteMenus,
    setFavoriteMenus: state.setFavoriteMenus,
  }));

  const { data: menusData, loading: loadingQuery } =
    useGetAllMenusByBusinessIdQuery({
      onCompleted: (data) => {
        const reducedMenus = data?.getAllMenusByBusinessID?.reduce(
          (acc, menu) => {
            acc[menu?._id] = menu.isFavorite;
            return acc;
          },
          {} as any
        );

        setFavoriteMenus(reducedMenus);
      },
      onError: () => {
        showToast({
          status: "error",
          message: "Error",
        });
      },
    });

  const { t } = useTranslation("businessMenu");

  // todo: unnecessary memoization
  // Getting all categories
  const { data } = useGetAllCategoriesByBusinessQuery();
  const allCategories = useMemo(
    () => data?.getAllCategoriesByBusiness ?? [],
    [data?.getAllCategoriesByBusiness]
  );

  const [updateMenu, { loading: loadingUpdate }] = useUpdateMenuMutation({
    onCompleted: (data) => { },
    updateQueries: {
      getAllMenusByBusinessID: (prev, { mutationResult }) => {
        return Object.assign({}, prev, {
          getAllMenusByBusinessID: mutationResult?.data?.updateMenu,
        });
      },
    },
  });

  const [deleteMenu, { loading: loadingDelete }] = useDeleteMenuMutation({
    onCompleted: (data) => { },
    update: (cache, { data }) => {
      // @ts-ignore
      const { getAllMenusByBusinessID } = cache.readQuery({
        query: GetAllMenusByBusinessIdDocument,
      });
      cache.writeQuery({
        query: GetAllMenusByBusinessIdDocument,
        data: {
          getAllMenusByBusinessID: getAllMenusByBusinessID.filter(
            (menu: { _id: string | undefined }) =>
              menu._id !== data?.deleteMenu._id
          ),
        },
      });
    },
  });

  const { allProducts } = useProductMutationHook();

  const [inputValue, setInputValue] = useState(``);

  const isEditingMenu = useAppStore((state) => state.isEditingMenu);
  const sectionMap = useAppStore((state) => state.sectionMap);
  const menuId = useAppStore(
    (state) => state?.menu ?? menusData?.getAllMenusByBusinessID?.[0]?._id
  );
  const categoryId = useAppStore((state) => state.category ?? "all");
  const setCategory = useAppStore((state) => state.setCategory);
  const setSectionMap = useAppStore((state) => state.setSectionMap);
  const seIsEditingMenu = useAppStore((state) => state.seIsEditingMenu);
  const resetEditingAndSectionMap = useAppStore(
    (state) => state.resetEditingAndSectionMap
  );

  const numColumns = useNumOfColumns(isEditingMenu);

  const selectedMenu = menusData?.getAllMenusByBusinessID?.find(
    (menu) => menu?._id === menuId
  );

  const allCategory = useMemo(
    () => ({
      __typename: "Category",
      _id: "all",
      name: t("all"),
      description: null,
    }),
    [t]
  );

  const sectionsWithAll = useMemo(
    () => [allCategory, ...allCategories],
    [allCategory, allCategories]
  );

  const categoriesIdsOnMenu = useMemo(() => {
    const menuSections = selectedMenu?.sections ?? [];
    if (!menuSections.some((section) => section.category._id === "all")) {
      return ["all", ...menuSections.map((section) => section.category._id)];
    }

    return menuSections.map((section) => section.category._id);
  }, [selectedMenu?.sections]);

  const productsOnMenu = useMemo(() => {
    const sections = selectedMenu?.sections;
    if (!sections || sections.length === 0) {
      return [];
    }
    const allProducts = sections.flatMap(
      (section) => section.products?.map((product) => product._id) ?? []
    );
    return categoryId === "all"
      ? allProducts
      : sections
        .filter((section) => section.category._id === categoryId)
        .flatMap(
          (section) => section.products?.map((product) => product._id) ?? []
        );
  }, [categoryId, selectedMenu?.sections]);

  const selectedCategories = useMemo(() => {
    return allCategories.filter((cat) => categoriesIdsOnMenu.includes(cat._id));
  }, [allCategories, categoriesIdsOnMenu]);

  const productsFiltereByCategory = useMemo(() => {
    return (
      categoryId === "all" && !isEditingMenu
        ? allProducts
        : allProducts.filter((product): product is Product =>
          categoryId ? product?.category?._id === categoryId : true
        )
    ).filter(Boolean);
  }, [allProducts, categoryId, isEditingMenu]);

  const productsFiltereOnMenu = useMemo(() => {
    return productsFiltereByCategory.filter((product): product is Product =>
      productsOnMenu.includes(product?._id ?? "")
    );
  }, [productsFiltereByCategory, productsOnMenu]);

  const setProductCheckbox = useCallback(
    (selected, _id) => {
      const newProductsMap = new Map();
      const newCategoriesMap = new Map();
      const allProducts = sectionMap.get(categoryId);
      // @ts-ignore
      for (const [categoryKey, productMap] of sectionMap.entries()) {
        newCategoriesMap.set(categoryKey, productMap);
      }

      if (allProducts) {
        for (const [key, value] of allProducts.entries()) {
          newProductsMap.set(key, value);
        }
      }

      newProductsMap.set(_id, selected);
      setSectionMap(newCategoriesMap.set(categoryId, newProductsMap));
    },
    [categoryId, sectionMap, setSectionMap]
  );

  const renderProductCard = useCallback(
    ({ item, index }: { item: Product | null; index: number }) => {
      if (!item) return null;

      return (
        <ProductCard
          description={item.description ?? ""}
          price={parseToCurrency(item.price, item.currency)}
          ctaTitle={"Edit Item"}
          imageUrl={item.imageUrl ?? ""}
          name={item.name}
          quantity={item.quantity}
        />
      );
    },
    []
  );

  const renderProductTile = useCallback(
    ({ item }: { item?: Product | null; index: number }) => {
      if (!item || (categoryId === "all" && isEditingMenu)) {
        return null;
      }

      let isSelected = false;
      if (sectionMap.get(categoryId)) {
        if (sectionMap.get(categoryId).get(item._id)) {
          isSelected = true;
        }
      }

      return (
        <ProductTileWithCheckbox
          name={item.name}
          ctaTitle={"Edit Item"}
          imageUrl={item.imageUrl ?? ""}
          isChecked={isSelected}
          onCheck={(selected) => setProductCheckbox(selected, item._id)}
          description={item.description}
          paused={item.paused}
        />
      );
    },
    [categoryId, isEditingMenu, sectionMap, setProductCheckbox]
  );

  const onEditMEnu = useCallback(() => {
    const nextCategory =
      categoryId === "all" ? allCategories[0]._id : categoryId;
    console.log("nextCategory", nextCategory)
    const sectionMap = new Map();
    const selectedMenuSections =
      menusData?.getAllMenusByBusinessID.find((menu) => menu?._id === menuId)
        ?.sections ?? [];
    selectedMenuSections.forEach((section) => {
      const productMap = new Map();
      section?.products?.forEach((product) =>
        productMap.set(product._id, true)
      );
      sectionMap.set(section.category._id, productMap);
    });

    setCategory(nextCategory);
    setSectionMap?.(sectionMap);
    seIsEditingMenu(true);
  }, [
    menuId,
    menusData,
    seIsEditingMenu,
    setSectionMap,
    setCategory,
    allCategories,
    categoryId,
  ]);

  const icontype = useMemo(() => {
    if (!isEditingMenu) {
      return selectedMenu?.isFavorite ? "StarFill" : "StarOutline";
    }
    return selectedMenu?._id && favoriteMenus[selectedMenu?._id]
      ? "StarFill"
      : "StarOutline";
  }, [
    favoriteMenus,
    isEditingMenu,
    selectedMenu?._id,
    selectedMenu?.isFavorite,
  ]);

  const [searchString, setSearchString] = useState("");

  const filteredProducts = useMemo(() => {
    return searchProductsByName(searchString, productsFiltereOnMenu);
  }, [searchString, productsFiltereOnMenu]);

  const filteredProductsByCategory = useMemo(() => {
    return searchProductsByName(searchString, productsFiltereByCategory);
  }, [searchString, productsFiltereByCategory]);


  const theme = useTheme()
  const router = useRouter()

  const { data: businessData } = useGetBusinessInformationQuery()

  const shareMenuLink = useCallback(() => {
    if (!businessData?.getBusinessInformation._id) throw new Error("No business id")

    const customerPath = `${process.env.FRONTEND_URL}/${router.locale ?? "en"}${customerRoute['/customer/[businessId]'].replace("[businessId]", businessData?.getBusinessInformation._id)}`

    const menuIdQuery = `${customerPath}?menuId=${menuId}`
    navigator.clipboard.writeText(menuIdQuery)

    showToast({ message: t("shareLink") })
  }, [businessData?.getBusinessInformation._id, menuId, router.locale, t],)


  return (
    <Box
      p={"4"}
      flex={1}
      borderWidth={1}
      borderRadius={"md"}
      borderColor={"trueGray.400"}
      backgroundColor={"white"}
    >
      <HStack flexDirection={"row"} mb={"2"} space={4}>
        <HStack space={3}>
          {isEditingMenu ? (
            <Input
              size={"2xl"}
              width={"auto"}
              value={inputValue}
              variant="underlined"
              InputRightElement={<BsPencilSquare />}
              placeholder={selectedMenu?.name as string}
              onChangeText={setInputValue}
            />
          ) : (
            <Heading w={"auto"} isTruncated>
              {selectedMenu?.name}
            </Heading>
          )}

          <HStack>
            <Pressable
              disabled={!isEditingMenu}
              onPress={() =>
                selectedMenu?._id &&
                setFavoriteMenus({
                  ...favoriteMenus,
                  [selectedMenu?._id]: !favoriteMenus[selectedMenu?._id],
                })
              }
            >
              <Icon type={icontype} color={theme.colors.yellow[500]} />
            </Pressable>

            <Pressable
              variant={"ghost"}
              disabled={!menuId}
              onPress={shareMenuLink}>
              <Icon type='Share' color={theme.colors.primary[500]} />
            </Pressable>
          </HStack>
        </HStack>

        {/* Categories */}
        <ScrollView flex={1} horizontal>
          {!isEditingMenu
            ? sectionsWithAll.map((category) => (
              <Button
                key={category._id}
                px={4}
                mr={2}
                m={0}
                minW={"100px"}
                disabled={categoryId === category._id}
                textDecorationColor={"black"}
                variant={categoryId === category._id ? "subtle" : "outline"}
                colorScheme={
                  categoryId === category._id ? "success" : "black"
                }
                onPress={() => setCategory(category._id)}
              >
                {category.name}
              </Button>
            ))
            : allCategories.map((category) => (
              <Button
                key={category._id}
                px={4}
                mr={2}
                m={0}
                minW={"100px"}
                disabled={categoryId === category._id}
                textDecorationColor={"black"}
                variant={categoryId === category._id ? "subtle" : "outline"}
                colorScheme={
                  categoryId === category._id ? "success" : "black"
                }
                onPress={() => setCategory(category._id)}
              >
                {category.name}
              </Button>
            ))}
        </ScrollView>
        <HStack flexDir={"row"} flexWrap={"wrap"} paddingY={2}>
          <Input
            placeholder={t("search")}
            variant="rounded"
            borderRadius="10"
            size="md"
            value={searchString}
            onChangeText={(text) => {
              setSearchString(text);
            }}
            InputLeftElement={
              <Box p="1">
                <Icon type="Search" />
              </Box>
            }
          />
        </HStack>
      </HStack>
      <Box flex={1} p={"4"}>
        {isEditingMenu ? (
          <FlatList
            key={numColumns}
            data={filteredProductsByCategory}
            numColumns={numColumns}
            renderItem={renderProductTile}
            keyExtractor={(item) => `${item?._id}`}
            ItemSeparatorComponent={() => <Box height={"4"} />}
          />
        ) : (
          <FlatList
            key={numColumns}
            data={filteredProducts}
            numColumns={numColumns}
            renderItem={renderProductCard}
            keyExtractor={(item) => `${item?._id}`}
            ItemSeparatorComponent={() => <Box height={"4"} />}
            ListEmptyComponent={<Text>{t("emptyProducts")}</Text>}
          />
        )}
      </Box>
      {isEditingMenu ? (
        <HStack justifyContent="space-between">
          <HStack alignItems="center" space={2} py={4}>
            <DeleteAlert
              title={t("deleteMenu")}
              body={t("deleteMenuBody")}
              cancel={t("cancel")}
              deleteItem={async () => {
                if (!menuId) throw new Error("Menu not found");

                await deleteMenu({
                  variables: {
                    id: menuId,
                  },
                });
              }}
            />
          </HStack>
          <HStack alignItems="center" space={2} justifyContent="end">
            <Button
              w={"100"}
              variant={"subtle"}
              onPress={resetEditingAndSectionMap}
            >
              {t("cancel")}
            </Button>
            <Button
              w={"100"}
              colorScheme="tertiary"
              isLoading={loadingDelete || loadingUpdate || loadingQuery}
              onPress={async () => {
                const newSections: { category: string; products: string[] }[] =
                  [];

                // TODO: THERE"S a bug here where the menu is favorite but the user doesn't change anything and it gets unmarked as favorite
                if (!sectionMap.size) {
                  console.warn("Nothing to do here");
                  return;
                }

                // @ts-ignore
                for (const [key, value] of sectionMap.entries()) {
                  // array width all the products that are selected
                  const selectedProducts = Array.from(value.keys()).filter(
                    (productKey) => value.get(productKey)
                  );
                  if (!key) continue;

                  newSections.push({
                    category: key,
                    products: selectedProducts as string[],
                  });
                }

                if (!menuId) {
                  console.warn("Nothing to do here");
                  return;
                }

                await updateMenu({
                  variables: {
                    input: {
                      _id: menuId,
                      name: inputValue,
                      sections: newSections,
                      isFavorite: favoriteMenus[menuId],
                    },
                  },
                });
                resetEditingAndSectionMap();
              }}
            >
              {t("save")}
            </Button>
          </HStack>
        </HStack>
      ) : (
        <Button
          alignSelf={"end"}
          colorScheme={"tertiary"}
          w={"100"}
          onPress={onEditMEnu}
        >
          {t("editMenu")}
        </Button>
      )}
    </Box>
  );
}

export default MenuProducts;
