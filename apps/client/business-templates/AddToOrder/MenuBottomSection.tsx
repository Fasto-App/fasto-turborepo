import React from 'react'

import { HStack, Heading, VStack, Input, Box, ScrollView } from 'native-base';
import { BottomSection } from '../../components/BottomSection';
import { ProductTile } from '../../components/Product/Product';
import { Tile } from '../../components/Tile';
import { useTranslation } from 'next-i18next';
import { GetMenuByIdQuery } from '../../gen/generated';
import { NewOrder } from './types';
import { Icon } from '../../components/atoms/NavigationButton';

export const MenuBottomSection = ({
  menuData,
  selectedUser,
  selectedCategory,
  setSelectedCategory,
  onAddOrIncreaseQnt,
}: {
  selectedUser?: string,
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>,
  selectedCategory: string
  menuData?: GetMenuByIdQuery,
  onAddOrIncreaseQnt: (id: NewOrder) => void,
}) => {
  const { t } = useTranslation("businessAddToOrder");
  const [searchString, setSearchString] = React.useState<string>("");

  return (
    <BottomSection>
      <HStack space={2}>
        <Heading pr={10}>{t("menu")}</Heading>
        <ScrollView horizontal={true} pb={2}>
          <HStack space={2}>
            {menuData?.getMenuByID?.sections?.map((section) => (
              <Tile
                key={section.category._id}
                selected={section.category._id === selectedCategory}
                onPress={() => setSelectedCategory(section.category._id)}
              >
                {section.category.name}
              </Tile>
            ))}
          </HStack>
        </ScrollView>
      </HStack>
      <VStack flexDir={"row"} flexWrap={"wrap"} paddingY={2}>
        <Input
          placeholder={t("search")}
          variant="rounded"
          borderRadius="10"
          size="md"
          value={searchString}
          onChangeText={(text) => setSearchString(text)}
          InputLeftElement={<Box p="1"><Icon type="Search" /></Box>}
        />
      </VStack>
      <ScrollView pt={2}>
        <VStack flexDir={"row"} flexWrap={"wrap"} space={4}>
          {menuData?.getMenuByID.items?.map(product => (
            <ProductTile
              ctaTitle={t("add")}
              key={product._id}
              name={product.name}
              imageUrl={product.imageUrl ?? ""}
              description={product.description}
              quantity={product.quantity}
              hideButton={
                !!product.blockOnZeroQuantity &&
                !product.quantity
              }
              onPress={() => {
                onAddOrIncreaseQnt({
                  _id: selectedUser ? `${product._id}:${selectedUser}` : product._id,
                  name: product.name,
                  imageUrl: product.imageUrl,
                  description: product.description,
                  quantity: product.quantity,
                  price: product.price,
                  selectedUser,
                  orderQuantity: 0,
                  productId: product._id,
                })
              }}
            />
          ))}

          {/* {filteredSections.map((section) => (
                  <React.Fragment key={section.category._id}>
                    {selectedCategory === section.category._id &&
                      section.products?.map((product) => (
                        <ProductTile
                          ctaTitle={t("add")}
                          key={product._id}
                          name={product.name}
                          imageUrl={product.imageUrl ?? ""}
                          description={product.description}
                          quantity={product.quantity}
                          hideButton={
                            !!product.blockOnZeroQuantity &&
                            !product.quantity
                          }
                          onPress={() => {
                            onAddOrIncreaseQnt({
                              _id: selectedUser ? `${product._id}:${selectedUser}` : product._id,
                              name: product.name,
                              imageUrl: product.imageUrl,
                              description: product.description,
                              quantity: product.quantity,
                              price: product.price,
                              selectedUser,
                              orderQuantity: 0,
                              productId: product._id,
                            })
                          }}
                        />
                      ))}
                  </React.Fragment>
                ))} */}
        </VStack>
      </ScrollView>
    </BottomSection>
  )
}
