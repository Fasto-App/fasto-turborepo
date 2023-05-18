import React from "react"
import { useRouter } from "next/router";
import { Avatar, HStack, Text, useTheme, VStack } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { customerPathName, customerTitlePath, PathNameKeys } from "../../routes";
import { getClientCookies } from "../../cookies";
import { useGetBusinessInformation } from "../../hooks";
import { OrangeBox } from "../../components/OrangeBox";
import { useTranslation } from "next-i18next";

const plaholderImage = "https://via.placeholder.com/150"

const ClientNavBar = (props: { tableNumber?: string }) => {
  const { tableNumber } = props

  const route = useRouter();
  const { productId, businessId } = route.query
  const token = getClientCookies(businessId as string)
  const theme = useTheme();
  const { t } = useTranslation("common")
  const isSplit = route.pathname === customerTitlePath.Split

  const { data: businessInfo } = useGetBusinessInformation()

  return (
    <>
      <OrangeBox height={"12"} />
      <HStack
        p={1}
        my={2}
        mx={2}
        background={"white"}
        borderRadius={"lg"}
        justifyContent={"space-around"}
        alignItems={"center"}
        borderWidth={1}
        borderColor={"coolGray.300"}
      >
        {/* Avatar or back button */}
        {productId || isSplit || !token ?
          <NavigationButton
            type={"ArrowBack"}
            color={theme.colors.info[600]}
            onPress={() => {
              // this should explicitly go back to the menu page
              route.back();
            }}
          />
          : <Avatar
            size="48px"
            source={{ uri: businessInfo?.getBusinessById.picture ?? plaholderImage }}
          />}
        <Text textAlign={"center"} w={"50%"} fontSize={"lg"} color="coolGray.800" overflow={"break-word"} bold>
          {t(customerPathName[route.pathname as PathNameKeys])}
        </Text>
        <VStack alignItems={"center"}>
          <Text fontSize={"lg"} color="coolGray.800" bold>
            {t("table")}
          </Text>
          <Text fontSize={"lg"} color="coolGray.800" bold>
            {tableNumber || "∞"}
          </Text>
        </VStack>
      </HStack>
    </>
  );
};

ClientNavBar.displayName = "ClientNavBar"

export { ClientNavBar };
