import React, { useCallback, useMemo, useState } from 'react'
import { Box, Button, Checkbox, FlatList, Heading, HStack, Input, Text } from 'native-base'
import { ProductCard, ProductTile } from '../../components/Product/Product'
import { Product } from '../../components/Product/types'
import { useNumOfColumns } from '../../hooks'
import { useCategoryMutationHook } from '../../graphQL/CategoryQL'
import { useProductMutationHook } from '../../graphQL/ProductQL'
import { DeleteAlert } from '../../components/DeleteAlert'
import { useAppStore } from '../UseAppStore'
import { BsPencilSquare } from 'react-icons/bs';
import { useMenuMutationHook } from '../../graphQL/MenuQL'
import { MenuSections } from './types'

const texts = {
  editMenu: "Edit Menu",
  cancel: "Cancel",
  save: "Save",
  delete: "Delete",
}

function MenuProducts({ menusData }: { menusData: MenuSections }) {
  const { allCategories } = useCategoryMutationHook()
  const { allProducts } = useProductMutationHook()
  const { deleteMenu, updateMenu } = useMenuMutationHook()
  const [inputValue, setInputValue] = useState(``)

  const isEditingMenu = useAppStore(state => state.isEditingMenu)
  const sectionMap = useAppStore(state => state.sectionMap)
  const menuId = useAppStore(state => state?.menu ?? menusData?.[0]?._id)
  const categoryId = useAppStore(state => state.category ?? allCategories?.[0]?._id)
  const setMenu = useAppStore(state => state.setMenu)
  const setCategory = useAppStore(state => state.setCategory)
  const setSectionMap = useAppStore(state => state.setSectionMap)
  const seIsEditingMenu = useAppStore(state => state.seIsEditingMenu)
  const resetEditingAndSectionMap = useAppStore(state => state.resetEditingAndSectionMap)

  const numColumns = useNumOfColumns(isEditingMenu)

  const selectedMenu = menusData?.find(menu => menu._id === menuId)
  console.log("Selected Menu", selectedMenu)


  const categoriesIdsOnMenu = useMemo(() => selectedMenu?.sections?.map(section => section.category._id) ?? [],
    [selectedMenu?.sections])
  console.log("Categories IDS on Menu", categoriesIdsOnMenu)


  const productsOnMenu = useMemo(() => selectedMenu?.sections?.find(section => section.category._id === categoryId)?.products.map(product => product._id) ?? [], [categoryId, selectedMenu?.sections])
  console.log("Products de um menu por categoria", productsOnMenu)

  const selectedCategories = useMemo(() => {
    return allCategories.filter(cat => categoriesIdsOnMenu.includes(cat._id))
  }, [allCategories, categoriesIdsOnMenu])

  console.log("Selected Categories", selectedCategories)


  const productsFiltereByCategory = useMemo(() => {
    return allProducts.filter(product => product?.category?._id === categoryId)
  }, [allProducts, categoryId])

  console.log("Products Filtered by Category", productsFiltereByCategory)

  const productsFiltereOnMenu = useMemo(() => {
    return productsFiltereByCategory.filter(product => productsOnMenu.includes(product._id))
  }, [productsFiltereByCategory, productsOnMenu])

  console.log("Products Filtered on Menu", productsFiltereOnMenu)

  console.log("%cSection MAP", "color: green", sectionMap)


  const setProductCheckbox = useCallback((selected, _id) => {
    const newProductsMap = new Map()
    const newCategoriesMap = new Map()
    const allProducts = sectionMap.get(categoryId)

    console.log("%cSection MAP", "color: pink", sectionMap)
    console.log("%allProducts", "color: pink", allProducts)
    console.log("%categoryId", "color: pink", categoryId)

    // @ts-ignore
    for (const [categoryKey, productMap] of sectionMap.entries()) {
      newCategoriesMap.set(categoryKey, productMap)
    }

    if (allProducts) {
      for (const [key, value] of allProducts.entries()) {
        newProductsMap.set(key, value)
      }
    }

    newProductsMap.set(_id, selected)
    setSectionMap(newCategoriesMap.set(categoryId, newProductsMap))
  }, [categoryId, sectionMap, setSectionMap])



  const renderCategories = ({ item, index }) => {
    const selected = categoryId === item._id
    return (
      <Button
        px={4}
        m={0}
        minW={"100px"}
        disabled={selected}
        textDecorationColor={"black"}
        variant={selected ? 'subtle' : 'outline'}
        colorScheme={selected ? "success" : "black"}
        onPress={() => setCategory(item._id)}
      >
        {item.name}
      </Button>
    )
  }

  const renderProductCard = useCallback(({ item, index }: { item: Product, index: number }) => {
    return (
      <ProductCard
        product={item}
        onEdit={() => console.log("HELLO")}
        singleButton={true}
      />)
  }, [])

  const renderProductTile = useCallback(({ item, index }: { item: Product, index: number }) => {
    let isSelected = false
    if (sectionMap.get(categoryId)) {
      if (sectionMap.get(categoryId).get(item._id)) {
        isSelected = true
      }
    }

    return (
      <ProductTile
        product={item}
        isChecked={isSelected}
        onCheckboxClick={(selected) => setProductCheckbox(selected, item._id)}
      />)
  }, [categoryId, sectionMap, setProductCheckbox])


  const renderListCard = useCallback(() => {
    return (

      <FlatList
        key={numColumns}
        data={productsFiltereOnMenu}
        numColumns={numColumns}
        renderItem={renderProductCard}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <Box height={"4"} />}
        ListEmptyComponent={<Text>To start adding products press "Edit Menu"</Text>}
      />

    )
  }, [productsFiltereOnMenu, numColumns, renderProductCard])

  const renderListTile = useCallback(() => {
    return (

      <FlatList
        key={numColumns}
        data={productsFiltereByCategory}
        numColumns={numColumns}
        renderItem={renderProductTile}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <Box height={"4"} />}
      />

    )
  }, [numColumns, productsFiltereByCategory, renderProductTile])

  const onEditMEnu = useCallback(() => {
    const sectionMap = new Map()
    const selectedMenuSections = menusData.find(menu => menu._id === menuId)?.sections ?? []

    selectedMenuSections.forEach(section => {
      const productMap = new Map()
      section?.products?.forEach(product => productMap.set(product._id, true))
      sectionMap.set(section.category._id, productMap)
    })

    setSectionMap?.(sectionMap)
    seIsEditingMenu(true)

    console.log("Edit Menu")
  }, [menuId, menusData, seIsEditingMenu, setSectionMap])

  return (
    <Box
      p={"4"}
      flex={1}
      borderWidth={1}
      borderRadius={"md"}
      borderColor={"trueGray.400"}
      backgroundColor={"white"}
    >
      <HStack flexDirection={"row"} mb={"2"} space={10} justifyContent={"center"} pl={8}>
        <Box width={300}>
          {isEditingMenu ?
            <Input
              size={"2xl"}
              width={"auto"}
              value={inputValue}
              variant="underlined"
              InputRightElement={<BsPencilSquare />}
              placeholder={selectedMenu?.name as string}
              onChangeText={setInputValue}
            /> :
            <Heading w={"auto"} isTruncated>
              {selectedMenu?.name}
            </Heading>
          }
        </Box>



        {/* Edit Button and List with buttons that represent all the categories */}
        {!isEditingMenu ? <Button
          colorScheme={"tertiary"}
          px={4}
          m={0}
          minW={"100px"} onPress={onEditMEnu}
        >
          {texts.editMenu}
        </Button> : null}



        <FlatList
          key={isEditingMenu ? "edit" : "list"}
          horizontal
          data={isEditingMenu ? allCategories : selectedCategories}
          renderItem={renderCategories}
          ItemSeparatorComponent={() => <Box w={4} />}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text>To start adding products, navigato to Categories / Products</Text>}
        />


      </HStack>

      <Box flex={1} p={"4"}>
        {isEditingMenu ?
          <>
            {/* Future feature */}
            {false ?? <Checkbox
              value="Select All"
              my="1"
              isChecked={false}
              alignSelf={"flex-end"}>
              Select All
            </Checkbox>}
            {renderListTile()}
          </>
          :
          renderListCard()}
      </Box>


      {isEditingMenu ?
        <HStack justifyContent="space-between">
          <HStack alignItems="center" space={2} py={4}>
            <DeleteAlert title={"Delete Menu"} deleteItem={async () => {
              await deleteMenu({
                variables: {
                  id: menuId
                }
              })

              console.log("deleting", menuId)
            }} />
          </HStack>
          <HStack alignItems="center" space={2} justifyContent="end" py={4}>
            <Button w={"100"} variant={"subtle"} onPress={resetEditingAndSectionMap}>
              {texts.cancel}
            </Button>
            <Button
              w={"100"}
              colorScheme="tertiary"
              onPress={async () => {
                console.log(sectionMap)
                const newSections = []

                if (!sectionMap.size) {
                  console.warn("Nothing to do here")
                  return;
                }

                // @ts-ignore
                for (const [key, value] of sectionMap.entries()) {
                  const selectedProducts = Array.from(value.keys()).filter(productKey => value.get(productKey)) // array width all the products
                  newSections.push({ category: key, products: selectedProducts })
                }

                console.log(newSections);

                await updateMenu({
                  variables: {
                    input: {
                      _id: menuId,
                      name: inputValue,
                      sections: newSections
                    }
                  }
                })
                resetEditingAndSectionMap()
              }}>{texts.save}
            </Button>
          </HStack>
        </HStack>
        : null}
    </Box>
  )
}

export default MenuProducts