import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, HStack, VStack, Text, Image, Heading, ScrollView } from 'native-base';
import { PRODUCT_PLACEHOLDER_IMAGE, parseToCurrency } from 'app-helpers';
import { useTranslation } from "next-i18next";
import { GetMostSellingProductsQuery } from '../../../gen/generated';

ChartJS.register(ArcElement, Tooltip, Legend);

const OrdersRow = ({
  orderType, number
}: any) => (
  <HStack justifyContent={"space-between"} paddingX={8} paddingY={2}>
    <Text fontSize={"lg"} fontWeight={"500"}>{orderType}</Text>
    <Text fontSize={"lg"} fontWeight={"500"}>{number}</Text>
  </HStack>)

export function PieChart({ data }: { data: GetMostSellingProductsQuery | undefined }) {
  const { t } = useTranslation("businessDashboard");
  return <VStack mt={2} p={2} space={2}
    bgColor={"white"}
  >
    <Heading textAlign={"center"} size={"sm"}>{t("mostSellingItems")}</Heading>
    {data?.getMostSellingProducts?.map((product, i) => <ProductItem
      key={product?._id}
      {...product}
      quantity={product?.totalOrdered}
      price={parseToCurrency(product?.price, product?.currency)}
    />)}
  </VStack>
}

const ProductItem = ({
  name, imageUrl, price, quantity = 1, category
}: any) => (
  <HStack justifyContent={"space-between"} space={2} padding={2} >
    <Box>
      <Image
        size={"sm"}
        source={{ uri: imageUrl || PRODUCT_PLACEHOLDER_IMAGE }}
        alt={""}
        borderRadius={5}
      />
    </Box>
    <Box flex={1}>
      <Text fontSize={"lg"} fontWeight={"500"}>{name}</Text>
      <Text fontSize={"md"} fontWeight={"500"} color={"gray.600"} fontStyle={"italic"}>{category.name}</Text>
    </Box>
    <VStack>

      <Text alignSelf={"center"} fontSize={"md"} fontWeight={"500"}>{price}</Text>
      <Text
        fontSize={"md"}
        fontStyle={"italic"}
        color={"gray.500"}
        textAlign={"right"}>{`+${quantity}`}</Text>
    </VStack>
  </HStack>
)
