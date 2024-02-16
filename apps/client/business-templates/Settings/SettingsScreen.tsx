import { localeObj, typedKeys, Locale } from 'app-helpers'
import { Box, Button, Center, FlatList, HStack, Heading, ScrollView, VStack } from 'native-base'
import React, { useState } from 'react'
import { ManageAccount } from './ManageAccount'
import { ManageBusiness } from './ManageBusiness'
import { ManageBusinessLocation } from './ManageLocation'
import { ManageEmployee } from './ManageEmployee'
import { UpperSection } from '../../components/UpperSection'
import { OrangeBox } from '../../components/OrangeBox'
import { BottomSection } from '../../components/BottomSection'
import { useRouter } from 'next/router'
import { FDSSelect } from "../../components/FDSSelect";
import { useTranslation } from "next-i18next";
import { QRcodeAndShare } from './QRcodeAndShare'
import QRCode from 'react-qr-code'
import { useGetBusinessInformationQuery } from '../../gen/generated'
import { customerRoute } from 'fasto-route'
import NextImage from 'next/image'

const manageTabs = {
  manageBusiness: {
    button_title: "manageBusiness",
  },
  manageLocation: {
    button_title: "manageLocation",
  },
  manageEmployees: {
    button_title: "manageEmployees",
  },
  manageAccount: {
    button_title: "manageAccount",
  },
  QRcodeAndShare: {
    button_title: "QRcodeAndShare"
  }
} as const

type ManageTab = keyof typeof manageTabs

type ManageTabKeys = keyof typeof manageTabs
const tabs = typedKeys(manageTabs)

export const SettingsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<ManageTabKeys>("QRcodeAndShare")
  const { data, loading, error } = useGetBusinessInformationQuery()

  const { t } = useTranslation("businessSettings")

  const router = useRouter()
  const locale = router.locale

  const customerPath = data?.getBusinessInformation._id ? `${process.env.FRONTEND_URL}/${locale ?? "en"}${customerRoute['/customer/[businessId]'].replace("[businessId]", data?.getBusinessInformation._id)}`
    : null

  const renderCategories = ({ item }: { item: ManageTab }) => {
    const selected = selectedTab === item
    return (
      <Button
        px={4}
        m={0}
        minW={"100px"}
        borderColor={selected ? 'primary.500' : "gray.300"}
        disabled={selected}
        variant={selected ? 'outline' : 'outline'}
        colorScheme={selected ? "primary" : "black"}
        onPress={() => setSelectedTab(item)}
      >
        {t(manageTabs[item].button_title)}
      </Button>
    )
  }

  return (
    <>
      <Box nativeID={"section-to-print"}>
        <Center flex={1} h={"100%"}>
          <VStack alignItems={"center"} space={8}>
            <Heading>
              {t("scanToViewMenu")}
            </Heading>
            <QRCode
              value={customerPath || ""}
              size={300}
            />
            <Heading>
              {data?.getBusinessInformation.name}
            </Heading>
            <NextImage
              src={data?.getBusinessInformation.picture ?? "https://via.placeholder.com/150"}
              alt={data?.getBusinessInformation.name}
              width={"100"}
              height={"100"}
              objectFit='cover'
              style={{ borderRadius: 5 }}
            />
          </VStack>
        </Center>
      </Box>
      <Box flex={1} shadow={"8"} backgroundColor={"white"} >
        <OrangeBox />
        <VStack m={"4"} space={"4"} flex={1}>
          <UpperSection>
            <HStack justifyContent={"space-between"}>
              <Heading>
                {t("title")}
              </Heading>

              <FDSSelect
                w="70"
                h="8"
                array={localeObj}
                selectedValue={router.locale as Locale}
                setSelectedValue={(value) => {
                  const path = router.asPath;
                  return router.push(path, path, { locale: value });
                }} />
            </HStack>
            <FlatList
              horizontal
              data={tabs}
              renderItem={renderCategories}
              ItemSeparatorComponent={() => <Box w={4} />}
              keyExtractor={(item) => item}
            />
          </UpperSection>
          <BottomSection>
            <ScrollView>
              {selectedTab === "manageLocation" ? <ManageBusinessLocation /> :
                selectedTab === "manageAccount" ? <ManageAccount /> :
                  selectedTab === "manageEmployees" ? <ManageEmployee /> :
                    selectedTab === "manageBusiness" ? <ManageBusiness /> :
                      selectedTab === "QRcodeAndShare" ? <QRcodeAndShare /> : null}
            </ScrollView>
          </BottomSection>
        </VStack>
      </Box>
    </>
  )
}


