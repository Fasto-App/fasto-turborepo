import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  FlatList,
  Heading,
  HStack,
  ScrollView,
  Text,
  useTheme,
  Pressable,
  useMediaQuery
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
import { copyMenuLinkToClipboard } from "./hooks";
import { Input } from "@/shadcn/components/ui/input";
import { BiSearch } from "react-icons/bi";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,

} from "@/shadcn/components/ui/alert-dialog";
import { Card, CardContent, CardTitle } from "@/shadcn/components/ui/card";

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
    copyMenuLinkToClipboard({
      businessId: businessData?.getBusinessInformation._id,
      locale: router.locale,
      menuId,
    })

    showToast({ message: t("shareLink") })
  }, [businessData?.getBusinessInformation._id, menuId, router.locale, t],)

  const isLargerThan768 = useMediaQuery({ minWidth: 768 });
  return (
    <Box
      p={"4"}
      flex={1}
      borderWidth={1}
      borderRadius={"md"}
      borderColor={"trueGray.400"}
      backgroundColor={"white"}
    >
      <HStack flexDirection={isLargerThan768 ? "column" : "row"} mb={"2"} space={4}>
        <HStack space={3} mb={isLargerThan768 ? "5" : "0"}>
          {isEditingMenu ? (
            <input
              className="w-2xl border-b-2 border-gray-300 focus:border-primary-500 text-lg p-2 outline-none"
              value={inputValue}
              placeholder={selectedMenu?.name as string}
              onChange={(e) => setInputValue(e.target.value)}
            />
          ) : (
            <Heading w={"auto"} isTruncated>
              {selectedMenu?.name}
            </Heading>
          )}

          <HStack space={2}>
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
        <div className="flex flex-row">
          <Input
            placeholder={t("search")}
            className="rounded-md w-full sm:max-w-xs mb-4 focus:border-primary-600"
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
          >

          </Input>
        </div>
        {/* Categories */}
        <ScrollView flex={1} horizontal>
          {!isEditingMenu
            ? sectionsWithAll.map((category) => (
              <div
                className={cn("p-1 sm:p-4 m-1 w-md text-md max-h-7 shadow-md text-black border border-gray-400 rounded-md content-center bg-white hover:text-success-600 hover:border-success-400 hover:cursor-pointer", categoryId === category._id ? 'bg-success-100 border border-success-700 text-suborder-success-700 font-semibold' : null)}
                key={category._id}
                // disabled={categoryId === category._id}
                onClick={() => setCategory(category._id)}
              >
                {category.name}
              </div>
            ))
            : allCategories.map((category) => (
              <div
                className={cn("p-1 sm:p-4 m-1 w-md text-md max-h-7 shadow-md text-black border border-gray-400 rounded-md content-center bg-white hover:text-success-600 hover:border-success-400 hover:cursor-pointer", categoryId === category._id ? 'bg-success-100 border border-success-700 text-suborder-success-700 font-semibold' : null)}
                key={category._id}
                // disabled={categoryId === category._id}
                onClick={() => setCategory(category._id)}
              >
                {category.name}
              </div>
            ))}
        </ScrollView>

      </HStack>
      <div className="h-full overflow-y-auto mt-4 sm:mt-2">
        {isEditingMenu ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredProductsByCategory.length > 0 ?
              filteredProductsByCategory.map((item: any) => (
                <div key={item._id} className="mb-4 w-full">
                  {renderProductTile({ item: item, index: 0 })}
                </div>
              ))
              :
              <div><h1>teste</h1></div>
            }
          </div>
        ) : (
          <div className="flex flex-row flex-wrap justify-center sm:justify-start">
            {filteredProducts.length > 0 ?
              filteredProducts.map((item: any) => (
                <div key={item._id} className="mb-4">
                  {renderProductCard({ item: item, index: 0 })}
                </div>
              ))
              :
              <Card className="shadow-md">
                <CardTitle className="text-primary-400 pt-2 text-lg">{t("emptyList")}</CardTitle>
                <CardContent className="p-4">
                  <Button
                    disabled={!categoryId}
                    variant="outline"
                    className='w-[100px] shadow-md  bg-primary-200 hover:bg-primary-400 text-primary-500 border border-primary-600 items-end mt-2'
                    onClick={onEditMEnu}>
                    {t("addItem")}
                  </Button>
                </CardContent>
              </Card>
            }
          </div>
        )}

      </div>
      {isEditingMenu ? (
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"}>{t("deleteMenu")}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[300px] bg-white rounded-md border border-gray-400 text-black text-xl">
                <AlertDialogHeader>
                  <p className="text-black">{t("deleteMenu")}</p>
                  <AlertDialogDescription className="">
                    {t("deleteMenuBody")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row justify-center space-x-6">
                  <AlertDialogCancel asChild>
                    <Button variant={"outline"}>{t("cancel")}</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button onClick={async () => {
                      if (!menuId) throw new Error("Menu not found");

                      await deleteMenu({
                        variables: {
                          id: menuId,
                        },
                      });
                    }} variant={"destructive"}>{t("deleteMenu")}</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className=" space-x-2 justify-end">
            <Button
              className="w-[100px] border-primary-600"
              variant={"outline"}
              onClick={resetEditingAndSectionMap}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="outline"
              className='w-[100px] bg-success-300 hover:bg-success-400 items-end'
              // isLoading={loadingDelete || loadingUpdate || loadingQuery}
              onClick={async () => {
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
              {/* <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> */}
              {t("save")}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          disabled={!categoryId}
          variant="outline"
          className='w-[100px] bg-success-300 hover:bg-success-400 items-end mt-2'
          onClick={onEditMEnu}>
          {t("edit")}
        </Button>
      )}
    </Box>
  );
}

export default MenuProducts;
