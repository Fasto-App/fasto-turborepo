import React, { useCallback } from 'react'
import { Heading } from 'native-base';
import { ProductTile, SkeletonProductTile } from '../../components/Product/Product';
import { Tile, NewTileLoading } from '../../components/Tile';
import { useTranslation } from 'next-i18next';
import { GetMenuByIdQuery, Product } from '../../gen/generated';
import { NewOrder } from './types';
import { ScrollArea, ScrollBar } from '@/shadcn/components/ui/scroll-area';
import { Input } from '@/shadcn/components/ui/input';
import debounce from 'lodash/debounce';
import { toast } from "sonner"

const searchProductsByName = (
  searchString: string,
  products?: Product[] | null
): Product[] => {
  if (!products || !searchString) {
    return products || [];
  }
  const escapedSearchString = searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(escapedSearchString, "gi");

  const filteredProducts = products.filter((product) => {
    const productsName = product.name.toLocaleLowerCase()
    const match = productsName.match(pattern)
    return !!match
  });

  return filteredProducts
};

export const AddToOrderBottomSection = ({
  menuData,
  selectedUser,
  selectedCategory,
  setSelectedCategory,
  onAddOrIncreaseQnt,
}: {
  selectedUser?: string,
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | undefined>>,
  selectedCategory?: string
  menuData?: GetMenuByIdQuery,
  onAddOrIncreaseQnt: (id: NewOrder) => void,
}) => {
  const { t } = useTranslation("businessAddToOrder");
  const [searchString, setSearchString] = React.useState<string>("");

  const products = React.useMemo(() => !selectedCategory ? menuData?.getMenuByID.items :
    menuData?.getMenuByID.sections?.find((section) => {
      return section.category._id === selectedCategory
    })?.products, [menuData?.getMenuByID.items, menuData?.getMenuByID.sections, selectedCategory]);

  // @ts-ignore
  const filteredProducts = React.useMemo(() => searchProductsByName(searchString, products), [products, searchString]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetText = useCallback(debounce((e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.value) return setSearchString("");

    toast.info(`Searching ${e.target.value} ...`, {
      duration: 1000,
      action: {
        label: "Ok",
        onClick: () => console.log("Undo"),
      },
    })

    setSearchString(e.target.value);
  }, 500), [])

  return (
    <>
      <div className='row-span-1'>
        <div className={"grid grid-cols-8 row-span-2 gap-6 p-2 content-center items-center"}>
          <Heading>{t("menu")}</Heading>
          <div className="col-span-5">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
              {!menuData?.getMenuByID.sections?.length ? <div className="flex w-max space-x-4 p-4">
                {Array(10).fill(null).map(i => <NewTileLoading key={i} />)}
              </div>
                :
                <MemoizedCategoriesList
                  menuData={menuData}
                  setSelectedCategory={setSelectedCategory}
                  selectedCategory={selectedCategory}
                />
              }
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="col-span-2">
            <Input type="text" placeholder={t("search")} onChange={debouncedSetText} />
          </div>
        </div>
      </div>
      <div className="row-span-7">
        {!products?.length ?
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-4 gap-4'>
            {Array(12).fill(null).map(i => <SkeletonProductTile key={i} />)}
          </div> :
          <MemoizedProducts
            products={filteredProducts}
            onAddOrIncreaseQnt={onAddOrIncreaseQnt}
            selectedUser={selectedUser}
          />}
      </div>
    </>
  )
}

const MemoizedProducts = React.memo(function ProductsList({
  products,
  onAddOrIncreaseQnt,
  selectedUser
}: any) {
  const { t } = useTranslation("businessAddToOrder");

  return <ScrollArea className="h-full w-full  whitespace-nowrap rounded-md border">
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-4 gap-4'>
      {products?.map((product: any) => (
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

const MemoizedCategoriesList = React.memo(function CategoriesList({
  menuData,
  setSelectedCategory,
  selectedCategory
}: any) {
  return (
    <div className="flex w-max space-x-4 p-4">
      <Tile
        selected={!selectedCategory}
        onPress={() => setSelectedCategory(undefined)}
      >
        {"All"}
      </Tile>
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
  )
})