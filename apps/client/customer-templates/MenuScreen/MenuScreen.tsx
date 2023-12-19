import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, SectionList, HStack, ScrollView, Skeleton, Spacer, VStack, Text, Divider, Input, Pressable, useTheme } from "native-base"
import { MenuItem } from "../../components/molecules/MenuItem";
import { Tab } from "./Tab";
import { useRouter } from "next/router";
import { customerRoute } from "fasto-route";
import { TakeoutDeliveryDineIn, useGetClientMenuQuery, useGetClientSessionQuery } from "../../gen/generated";
import { useTranslation } from "next-i18next";
import { Icon } from "../../components/atoms/NavigationButton";
import { ModalAddress } from "../../components/ModalAddress";
import { getClientCookies } from "../../cookies";


export const MenuScreen = () => {
  const router = useRouter();
  const { businessId, menuId } = router.query;
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const sectionListRef = useRef<typeof SectionList | null>(null);
  const scrollViewRef = useRef<typeof ScrollView | null>(null);
  const { t } = useTranslation("common")

  const theme = useTheme()

  const [isModalAddresOpen, setIsModalOpen] = useState(false);

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
      if (data.getClientMenu?.sections) {
        setSelectedCategory(data.getClientMenu.sections[0].category._id)
      }
    }
  });

  const { data: clientData, loading: clientLoadingData } = useGetClientSessionQuery({
    skip: !getClientCookies(businessId as string)
  })

  const inputValue = useMemo(() => {
    if (!clientData?.getClientSession.tab || !clientData?.getClientSession.tab) return ""
    const { type } = clientData?.getClientSession.tab

    if (!clientData?.getClientSession.user.address) return type

    const { streetAddress, city, stateOrProvince, complement } = clientData?.getClientSession.user.address

    return type === TakeoutDeliveryDineIn.Takeout ? `${type}` :
      `${type} to ${streetAddress}, ${complement} ${city} - ${stateOrProvince}`
  },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      clientData?.getClientSession.tab?.type,
      clientData?.getClientSession.user.address?.city,
      clientData?.getClientSession.user.address?.streetAddress,
      clientData?.getClientSession.user.address?.stateOrProvince]
  )

  const formatToSectionData = useMemo(() => {
    if (!data?.getClientMenu?.sections) return []
    return data?.getClientMenu.sections.map((section) => {
      return {
        title: section.category,
        data: section.products
      }
    })
  }, [data?.getClientMenu?.sections])

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
        {t("somethingWentWrong")}
      </Text>) :
      loadingQuery ? <LoadingMenu /> :
        <>
          <Box>
            {!inputValue ? null :
              <>
                <Pressable
                  paddingX={"4"}
                  paddingBottom={"3"}
                  paddingTop={"1"}
                  onPress={() => setIsModalOpen(!isModalAddresOpen)}
                  isDisabled={clientLoadingData}
                >
                  <Input
                    isReadOnly
                    color={"gray.500"}
                    fontSize={"lg"}
                    value={inputValue}
                    rightElement={(
                      <Box paddingX={"2"} >
                        <Icon color={theme.colors["gray"][400]} type="ArrowDown" />
                      </Box>)}
                  />
                </Pressable>
                {clientData?.getClientSession.tab?._id ? <ModalAddress
                  screenName="MenuScreen"
                  isOpen={isModalAddresOpen}
                  selectedType={clientData?.getClientSession.tab?.type}
                  setIsOpen={setIsModalOpen}
                  address={clientData?.getClientSession.user.address}
                  tabId={clientData?.getClientSession.tab?._id}
                /> : null}
              </>
            }
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
              itemVisiblePercentThreshold: 70, //means if 70% of the item is visible
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
                quantity={item?.quantity}
                onPress={() => {
                  if (typeof businessId !== "string") throw new Error("businessId is not a string")

                  router.push({
                    pathname: customerRoute["/customer/[businessId]/product-description/[productId]"],
                    query: {
                      businessId,
                      productId: item._id
                    }
                  })

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
                {t("noItems")}
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

