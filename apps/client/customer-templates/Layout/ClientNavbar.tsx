import React from "react"
import { useRouter } from "next/router";
import { Avatar, Badge, Box, HStack, Text, useTheme, VStack } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { customerPathName, customerRoute, PathNameKeys } from "fasto-route";
import { getClientCookies } from "../../cookies";
import { useGetBusinessInformation } from "../../hooks";
import { OrangeBox } from "../../components/OrangeBox";
import { useTranslation } from "next-i18next";
import { HourGlassAnimation } from "../../components/SuccessAnimation";
import { RequestStatus } from "../../gen/generated";

const plaholderImage = "https://via.placeholder.com/150"

const ClientNavBar = (props: { tableNumber?: string, status?: RequestStatus }) => {
  const { tableNumber, status } = props

  const route = useRouter();
  const { productId, businessId } = route.query
  const token = getClientCookies(businessId as string)
  const theme = useTheme();
  const { t } = useTranslation("common")
  const isSplit = route.pathname === customerRoute["/customer/[businessId]/split/[checkoutId]"]

  const { data: businessInfo } = useGetBusinessInformation()

  return (
    <>
      <OrangeBox height={"12"} />
      <HStack
        p={1}
        px={2}
        my={2}
        mx={2}
        background={"white"}
        borderRadius={"lg"}
        justifyContent={"space-around"}
        alignItems={"center"}
        borderWidth={1}
        borderColor={"coolGray.300"}
      >
        <Box flex={1}>
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
        </Box>
        <Text flex={1} textAlign={"center"} w={"50%"} fontSize={"lg"} color="coolGray.800" overflow={"break-word"} bold>
          {t(customerPathName[route.pathname as PathNameKeys])}
        </Text>

        {/* dont show table is none, show hour glass or badge when loading */}
        <VStack alignItems={"center"} flex={1}>
          {
            // status === "Pending" ?
            //   <Badge colorScheme={"warning"} variant={"solid"} >
            //     {t(status)}
            //   </Badge> :
            tableNumber ?
              <>
                <Text fontSize={"lg"} color="coolGray.800" bold>
                  {t("table")}
                </Text>
                <Text fontSize={"lg"} color="coolGray.800" bold>
                  {tableNumber || "∞"}
                </Text>
              </> : null
          }
        </VStack>
      </HStack>
    </>
  );
};

ClientNavBar.displayName = "ClientNavBar"

export { ClientNavBar };
