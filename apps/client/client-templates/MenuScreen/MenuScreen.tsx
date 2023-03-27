import React, { } from "react";
import { Box, FlatList, HStack, ScrollView, Skeleton, Spacer, VStack, Text } from "native-base"
import { MenuItem } from "../../components/molecules/MenuItem";
import { Tab } from "./Tab";
import router, { useRouter } from "next/router";
import { clientRoute } from "../../routes";
import { useGetClientMenuQuery } from "../../gen/generated";

// create array with 10 items
const items = Array.from(Array(10).keys());

// create an array with 10 names of food categories
const categories = ["Wines", "Beers", "Cocktails", "Spirits", "Soft Drinks", "Juices", "Water", "Coffee", "Tea", "Desserts"];

const renderItem = ({ item }: { item: number }) => (
  <MenuItem
    onPress={() => router.push(clientRoute.production_description("123"))}
  />)

export const MenuScreen = () => {
  const router = useRouter();
  const { businessId, menuId } = router.query;
  // function that fetchs either an specific menu or the default one
  const { data, loading: loadingQuery, error: errorQuery } = useGetClientMenuQuery({
    skip: !businessId,
    variables: {
      input: {
        business: businessId as string,
        _id: menuId as string,
      }
    }
  });

  return (
    errorQuery ? <Text fontSize={"lg"} textAlign={"center"}>Error</Text> :
      loadingQuery ? <LoadingMenu /> :
        <FlatList
          ListHeaderComponent={
            <>
              <ScrollView
                horizontal
                borderWidth={1}
                borderColor={"red.300"}
                backgroundColor={"white"}
                showsHorizontalScrollIndicator={false}
              >
                {categories.map((item, index) => (
                  <Tab
                    key={`$${item}_${index}`}
                    title={item}
                    index={index}
                    onPress={() => console.log("setSelectedIndex")}
                    last={true}
                    selected={index === 1}
                  />
                ))}
              </ScrollView>
              <Spacer size={"2"} />
            </>
          }
          data={items}
          renderItem={renderItem}
          stickyHeaderIndices={[0]}
          keyExtractor={(item) => item.toString()}
          ListEmptyComponent={<Text>No items</Text>}
        />
  );
};

const LoadingMenu = () => {
  return (
    <>
      <Skeleton h="8" backgroundColor={"red.200"} />
      <VStack pt={"2"}>
        {[1, 2, 3, 4, 5].map((i) => {
          return (
            <HStack key={i} justifyContent={"space-between"} p={2.5} space={2}>
              <Box width={"full"} flex={3}>
                <Skeleton maxW={"48"} h="4" rounded="full" startColor="gray.300" />
                <Box h={4} />
                <Skeleton.Text />
              </Box>

              <Box flex={1} borderRadius={"md"}>
                <Skeleton h="120" rounded="md" startColor="primary.100" />
              </Box>
            </HStack>
          )
        })}
      </VStack>
    </>
  )
}

