import React from 'react'

import { Heading, Input, Box } from 'native-base';
import { ProductTile } from '../../components/Product/Product';
import { Tile } from '../../components/Tile';
import { useTranslation } from 'next-i18next';
import { GetMenuByIdQuery } from '../../gen/generated';
import { NewOrder } from './types';
import { Icon } from '../../components/atoms/NavigationButton';
import { ScrollArea, ScrollBar } from '@/shadcn/components/ui/scroll-area';

export const AddToOrderBottomSection = ({
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
    <>
      <div className='row-span-1'>
        <div className={"grid grid-cols-8 row-span-2 gap-4 p-2 content-center items-center"}>
          <div className=""><Heading pr={10}>{t("menu")}</Heading></div>
          <div className="col-span-6">
            <CategoriesList
              menuData={menuData}
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
            />
          </div>
          <Input
            placeholder={t("search")}
            variant="rounded"
            borderRadius="10"
            size="md"
            h={"10"}
            value={searchString}
            onChangeText={(text) => setSearchString(text)}
            InputLeftElement={<Box p="1"><Icon type="Search" /></Box>}
          />
        </div>
      </div>
      <div className="row-span-5">
        <MemoizedProducts
          menuData={menuData}
          onAddOrIncreaseQnt={onAddOrIncreaseQnt}
          selectedUser={selectedUser}

        />
      </div>
    </>
  )
}

const MemoizedProducts = React.memo(function ProductsList({
  menuData,
  onAddOrIncreaseQnt,
  selectedUser
}: any) {
  const { t } = useTranslation("businessAddToOrder");

  return <ScrollArea className="h-full w-full  whitespace-nowrap rounded-md border">
    <div className='grid grid-cols-3 gap-4"'>

      {menuData?.getMenuByID.items?.map((product: any) => (
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

    </div>
    <ScrollBar orientation="vertical" />
  </ScrollArea>
})

function CategoriesList({
  menuData,
  setSelectedCategory,
  selectedCategory
}: any) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {menuData?.getMenuByID?.sections?.map((section: any) => (
          <Tile
            key={section.category._id}
            selected={section.category._id === selectedCategory}
            onPress={() => setSelectedCategory(section.category._id)}
          >
            {section.category.name}
          </Tile>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
