import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, Button, Center, HStack, VStack, Text, Image, Heading, ScrollView } from 'native-base';
import { PRODUCT_PLACEHOLDER_IMAGE, parseToCurrency } from 'app-helpers';
import { PriceTag } from '../../../components/molecules/PriceTag';
import { useTranslation } from "next-i18next";
import { GetMostSellingProductsQuery, useGetMostSellingProductsQuery } from '../../../gen/generated';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Pastel', 'Nata', 'Chicken', 'Peas', 'Coke'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const OrdersRow = ({
  orderType, number
}: any) => (
  <HStack justifyContent={"space-between"} paddingX={8} paddingY={2}>
    <Text fontSize={"lg"} fontWeight={"500"}>{orderType}</Text>
    <Text fontSize={"lg"} fontWeight={"500"}>{number}</Text>
  </HStack>)

export function PieChart({ data }: { data: GetMostSellingProductsQuery | undefined }) {
  const { t } = useTranslation("businessDashboard");
  return <ScrollView pr={2} pb={2}>
    <VStack mt={2} p={2} space={2}
      borderWidth={0.5}
      borderColor={"gray.50"}
      shadow={"2"}
      borderRadius={"md"}
      bgColor={"white"}
    >
      <Heading textAlign={"center"} size={"sm"}>{t("mostSellingItems")}</Heading>
      {data?.getMostSellingProducts?.map((product, i) => <ProductItem
        key={product?._id}
        {...product}
        quantity={20 - i} // this info will come from the product, right now we are faking the data 
      />)}
    </VStack>
    <Box
      p={2}
      borderWidth={0.5}
      borderColor={"gray.50"}
      borderRadius={"md"}
      bgColor={"white"}
      mt={4}
    >
      <Heading pb={4} textAlign={"center"} size={"sm"}>{t("numberOfOrders")}</Heading>
      <OrdersRow orderType={t("dineIn")} number={20} />
      <OrdersRow orderType={t("takeOut")} number={13} />
      <OrdersRow orderType={t("delivery")} number={5} />
    </Box>
  </ScrollView>
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

      <Text alignSelf={"center"} fontSize={"md"} fontWeight={"500"}>{parseToCurrency(price)}</Text>
      <Text
        fontSize={"md"}
        fontStyle={"italic"}
        color={"gray.500"}
        textAlign={"right"}>{`+${quantity}`}</Text>
    </VStack>
  </HStack>
)
