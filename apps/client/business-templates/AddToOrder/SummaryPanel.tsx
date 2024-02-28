import { typedValues, parseToCurrency, typedKeys } from 'app-helpers';
import { Text, Flex, Divider, Box, HStack, Heading, VStack, ScrollView, Button } from 'native-base';
import React from 'react'
import { LeftSideBar } from '../../components';
import { SummaryComponent } from '../../components/OrderSummary';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { GetTabByIdQuery } from '../../gen/generated';
import { NewOrder, OrderState } from './types';

export const SummaryPanel = ({
  tabData,
  orderItems,
  loading,
  onRemovePress,
  onPlusPress,
  onMinusPress,
  onSendToKitchen
}: {
  tabData?: GetTabByIdQuery,
  orderItems: OrderState,
  loading: boolean,
  onRemovePress: (id: string) => void,
  onPlusPress: (id: NewOrder) => void,
  onMinusPress: (id: NewOrder) => void,
  onSendToKitchen: () => void
}) => {
  const { t } = useTranslation("businessAddToOrder");
  const router = useRouter();

  const total = Object.values(orderItems).reduce(
    (acc, item) => acc + item.price * item.orderQuantity,
    0
  );

  return (
    <LeftSideBar>
      <Flex flex={1} pt={2} pb={4}>
        <Flex direction="row" justify="space-evenly" mb={4}>
          {tabData?.getTabByID?.table?.tableNumber ? (
            <Text py="2">
              {t("tableNumber", {
                number: tabData?.getTabByID?.table?.tableNumber,
              })}
            </Text>
          ) : null}
          {tabData?.getTabByID?.table?.tableNumber &&
            (tabData?.getTabByID?.users?.length ?? 0) > 1 ? (
            <Divider orientation="vertical" mx="3" />
          ) : null}
          {(tabData?.getTabByID?.users?.length ?? 0) > 1 ? (
            <Text py="2">
              {t("people", { number: tabData?.getTabByID?.users?.length })}
            </Text>
          ) : null}
        </Flex>
        <ScrollView flex={1}>
          {typedValues(orderItems)?.map((order, index) => {
            const personIndex = tabData?.getTabByID?.users?.findIndex(
              (user) => user._id === order.selectedUser
            );

            return (
              <SummaryComponent
                key={order._id + order.selectedUser}
                lastItem={index === typedValues(orderItems).length - 1}
                assignedToPersonIndex={
                  personIndex !== undefined && personIndex !== -1
                    ? personIndex + 1
                    : undefined
                }
                name={order.name}
                price={parseToCurrency(order.price, order.currency)}
                quantity={order.orderQuantity}
                onEditPress={() => console.log("EDIT")}
                onRemovePress={() => onRemovePress(order._id)}
                onPlusPress={() => onPlusPress(order)}
                onMinusPress={() => onMinusPress(order)}
              />
            );
          })}
        </ScrollView>
        <Box w={"100%"} justifyContent={"end"} pt={2}>
          <Divider mb="3" />
          <HStack justifyContent={"space-between"} pb={4}>
            <Heading size={"md"}>{t("total")}</Heading>
            <Heading size={"md"}>{parseToCurrency(total)}</Heading>
          </HStack>
          <VStack space={4}>
            <Button
              w={"full"}
              isLoading={loading}
              onPress={onSendToKitchen}
              isDisabled={typedKeys(orderItems).length <= 0}
            >
              {t("sendToKitchen")}
            </Button>
            <Button
              flex={1}
              p={0}
              variant="link"
              size="sm"
              colorScheme="info"
              onPress={() => router.back()}
              justifyContent={"end"}
            >
              {t("back")}
            </Button>
          </VStack>
        </Box>
      </Flex>
    </LeftSideBar>
  )
}
