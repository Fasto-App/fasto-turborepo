import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, Button, Center, HStack, VStack, Text, Image, Heading, ScrollView } from 'native-base';
import { PRODUCT_PLACEHOLDER_IMAGE, parseToCurrency } from 'app-helpers';
import { PriceTag } from '../../../components/molecules/PriceTag';

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

export function PieChart() {
  return <ScrollView pr={2} pb={2}>
    <Box
      p={2}
      borderWidth={0.5}
      borderColor={"gray.50"}
      borderRadius={"md"}
      bgColor={"white"}
    >
      <Heading textAlign={"center"} size={"xs"}>{"Top Categories"}</Heading>
      <Pie data={data} />
    </Box>

    <VStack mt={2} p={2} space={2}
      borderWidth={0.5}
      borderColor={"gray.50"}
      shadow={"2"}
      borderRadius={"md"}
      bgColor={"white"}
    >
      <Heading textAlign={"center"} size={"xs"}>{"Most Selling Items"}</Heading>
      <ProductItem />
      <ProductItem />
      <ProductItem />
    </VStack>
  </ScrollView>
}

const ProductItem = () => (
  <HStack justifyContent={"space-between"} space={2} padding={2} >
    <Box>
      <Image
        size={"sm"}
        source={{ uri: PRODUCT_PLACEHOLDER_IMAGE }}
        alt={""}
        borderRadius={5}
      />
    </Box>
    <Box flex={1}>
      <Text fontSize={"md"} fontWeight={"500"}>{"Plum Blossom"}</Text>
      <Text
        fontSize={"md"}
        fontStyle={"italic"}
        color={"gray.500"}
        textAlign={"justify"}>{"Categoria"}</Text>
    </Box>
    <Text alignSelf={"center"} fontSize={"md"} fontWeight={"500"}>{parseToCurrency(1000)}</Text>
  </HStack>
)
