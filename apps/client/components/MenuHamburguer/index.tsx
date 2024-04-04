import React from "react";
import { Divider, Menu, Text, Pressable, HStack, Avatar, VStack, Skeleton } from "native-base";
import { BusinessNavigationButton } from "../atoms/NavigationButton";
import { businessRoute } from "fasto-route";
import { useRouter } from "next/router";
import { clearBusinessCookies } from "../../cookies";
import { useGetBusinessInformationQuery, useGetUserInformationQuery } from "../../gen/generated";

type AccountTileProps = {
  isActive?: boolean;
  businessName?: string | null;
  employeeName?: string | null;
  uri?: string | null;
}

const AccountTile = ({ isActive = false, businessName, employeeName, uri }: AccountTileProps) => {
  return (
    <HStack flex={1} space={2}>
      {!uri ? <Skeleton
        borderWidth={1}
        borderColor="coolGray.200"
        endColor="warmGray.50"
        size="16"
        rounded="full" /> :
        <Avatar size={"lg"}
          backgroundColor={"white"}
          source={{ uri }}
          borderWidth={2}
          borderColor={isActive ? "green.500" : "gray.400"}
        />
      }
      <VStack flex={1} justifyContent="center">
        <Text fontSize={"24"} bold>{businessName}</Text>
        {isActive ? <Text fontSize={"16"}>{employeeName}</Text> : null}
      </VStack>
    </HStack>
  )
}

export function AccountMenu() {
  const router = useRouter();

  const { data } = useGetBusinessInformationQuery()
  const { data: clientInfo } = useGetUserInformationQuery()

  return <Menu
    placement="right bottom"
    trigger={triggerProps => {
      return (
        <Pressable
          padding={2}
          _hover={{
            backgroundColor: "gray.50", borderRadius: "md",
            shadow: "4",
          }}
          accessibilityLabel="More options menu" {...triggerProps}>
          <AccountTile
            isActive={!!data?.getBusinessInformation.picture}
            employeeName={clientInfo?.getUserInformation?.name}
            businessName={data?.getBusinessInformation.name}
            uri={data?.getBusinessInformation.picture}
          />
        </Pressable>
      );
    }}>
    < Divider mt="3" w="100%" />
    <Menu.Item backgroundColor={"white"}>
      <BusinessNavigationButton
        text={"Logout"}
        type={"Logout"}
        onPress={() => {
          clearBusinessCookies();
          router.push(businessRoute.login);
        }}
      />
    </Menu.Item>
  </Menu>
}