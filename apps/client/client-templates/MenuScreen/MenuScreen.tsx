import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, SectionList, HStack, ScrollView, Skeleton, Spacer, VStack, Text, Divider } from "native-base"
import { MenuItem } from "../../components/molecules/MenuItem";
import { Tab } from "./Tab";
import { useRouter } from "next/router";
import { clientRoute } from "../../routes";
import { useGetClientMenuQuery } from "../../gen/generated";
import { texts } from "./texts";

export const MenuScreen = () => {
  const router = useRouter();
  const { businessId, menuId } = router.query;
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const sectionListRef = useRef<typeof SectionList | null>(null);
  const scrollViewRef = useRef<typeof ScrollView | null>(null);

  // function that fetchs either an specific menu or the default one
  const { data, loading: loadingQuery, error: errorQuery } = useGetClientMenuQuery({
    skip: !businessId,
    variables: {
      input: {
        business: businessId as string,
        _id: menuId as string,
      }
    },
    onCompleted: (data) => {
      if (data.getClientMenu.sections) {
        setSelectedCategory(data.getClientMenu.sections[0].category._id)
      }
    }
  });

  const formatToSectionData = useMemo(() => {
    if (!data?.getClientMenu.sections) return []
    return data?.getClientMenu.sections.map((section) => {
      return {
        title: section.category,
        data: section.products
      }
    })
  }, [data?.getClientMenu.sections])

  useEffect(() => {
    if (selectedCategory && scrollViewRef.current) {
      const index = formatToSectionData.findIndex((item) => item.title._id === selectedCategory)
      // @ts-ignore
      scrollViewRef.current.scrollTo({ x: index * 100, animated: true })
    }
  }, [formatToSectionData, selectedCategory])

  return (
    errorQuery ? (
      <Text
        fontSize={"lg"}
        textAlign={"center"}>
        {texts.errorText}
      </Text>) :
      loadingQuery ? <LoadingMenu /> :
        <>
          <Box>
            <ScrollView
              horizontal
              borderWidth={1}
              borderColor={"red.300"}
              backgroundColor={"white"}
              showsHorizontalScrollIndicator={false}
              ref={scrollViewRef}
            >
              {formatToSectionData.map((item, index) => (
                <Tab
                  key={item.title._id}
                  title={item.title.name}
                  index={index}
                  onPress={() => {
                    setSelectedCategory(item.title._id)
                    // scroll to the section
                    if (sectionListRef.current) {
                      // @ts-ignore
                      sectionListRef.current.scrollToLocation({
                        sectionIndex: index,
                        itemIndex: 0,
                        animated: true,
                      })
                    }
                  }}
                  selected={selectedCategory === item.title._id}
                />
              ))}
            </ScrollView>
          </Box>
          <SectionList
            ref={sectionListRef}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50, //means if 50% of the item is visible
              waitForInteraction: false,
              // viewAreaCoveragePercentThreshold: 50, //means if 50% of the item is visible
              minimumViewTime: 500
            }}
            onViewableItemsChanged={info => {
              if (
                info.viewableItems?.[0]?.section?.title._id && selectedCategory &&
                info.viewableItems[0].section?.title._id !== selectedCategory) {
                setSelectedCategory(info.viewableItems[0].section.title._id)
              }
            }}
            sections={formatToSectionData}
            renderItem={({ item }) => (
              <MenuItem
                name={item.name}
                price={item.price}
                description={item.description}
                uri={item.imageUrl}
                onPress={() => {
                  if (typeof businessId !== "string") return
                  businessId && router.push(clientRoute.production_description(businessId, item._id))
                }}
              />)}
            renderSectionHeader={({ section: { title } }) => (
              <Box px={4} pt={4} backgroundColor={"white"}>
                <Text fontSize={"22"} fontWeight={"500"}>{title.name}</Text>
                <Divider />
              </Box>
            )}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={
              <Text
                textAlign={"center"}
                fontSize={"xl"}>
                {texts.noItems}
              </Text>}
          />
        </>
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

