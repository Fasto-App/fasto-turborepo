import React, { useState } from "react";
import { Box, HStack, Heading, ScrollView, Text, VStack, Spinner } from "native-base";
import { AreaChart } from "./Graphs/AreaChart";
import { PieChart } from "./Graphs/PieChart";
import { VerticalBar } from "./Graphs/VerticalBar";
import { OrangeBox } from "../../components/OrangeBox";
import { useTranslation } from "next-i18next";
import {
  DateType,
  useGetMostSellingProductsQuery,
  useGetPaidCheckoutByDateQuery,
  useGetUserInformationQuery,
} from "../../gen/generated";
import { parseToCurrency } from "app-helpers";

export const DashboardScreen = () => {
  const [selectedCheckoutFilter, setSelectedCheckoutFilter] = useState(
    DateType.SevenDays
  );
  const {
    data: checkoutData,
    error,
    loading,
  } = useGetPaidCheckoutByDateQuery({
    variables: {
      input: {
        type: selectedCheckoutFilter,
      },
    },
  });

  const { data } = useGetMostSellingProductsQuery()

  return (
    <Box flex={1} shadow={"2"} backgroundColor={"gray.100"}>
      <OrangeBox />
      <VStack space={4} p={4} flex={1}>
        <Panel
          mostSellingItem={data?.getMostSellingProducts?.[0]?.name}
          loading={loading} revenue={parseToCurrency(checkoutData?.getPaidCheckoutByDate?.total)} />
        <h1 className="text-3xl text-red-500 font-bold underline">Hello world!</h1>
        <HStack space={3} flex={1}>
          <ScrollView pr={2} pb={2} borderRadius={"md"}>
            <VStack space={8} flex={1}>
              <AreaChart
                selectedCheckoutFilter={selectedCheckoutFilter}
                setSelectedCheckoutFilter={setSelectedCheckoutFilter}
              />
              <VerticalBar />
            </VStack>
          </ScrollView>
          <PieChart data={data} />
        </HStack>
      </VStack>
    </Box>
  );
};
const Panel = ({ loading, revenue, mostSellingItem }: any) => {
  const userData = useGetUserInformationQuery();
  const { t } = useTranslation("businessDashboard");

  return (
    <VStack
      p={4}
      space={2}
      borderWidth={1}
      borderColor={"gray.50"}
      shadow={"2"}
      borderRadius={"md"}
      bgColor={"white"}
    >
      <Heading size="md">{`${t("hello")} ${userData?.data?.getUserInformation
        ?.name}`}</Heading>
      <Heading size="xs">{t("welcomeDashBoard")}</Heading>

      <HStack space={"3"}>
        <Box
          p={"3"}
          borderRadius={"md"}
          borderColor={"coolGray.200"}
          borderWidth={1}
          w={"48"}
        >
          <Text fontSize={"md"}>{t("totalRevenue")}</Text>
          <Text fontSize={"md"} bold>
            {loading
              ? <>
                {/* TODO: accessibility should be translated as well */}
                <Spinner accessibilityLabel="Loading posts" />  <Heading color="primary.500" fontSize="md">
                </Heading>
              </>
              : revenue}
          </Text>
        </Box>

        <Box
          p={"3"}
          borderRadius={"md"}
          borderWidth={1}
          borderColor={"coolGray.200"}
          w={"48"}
        >
          <Text fontSize={"md"}>{t("mostSellingItem")}</Text>
          <Text fontSize={"md"} bold>
            {loading ? <>
              {/* TODO: accessibility should be translated as well */}
              <Spinner accessibilityLabel="Loading posts" />  <Heading color="primary.500" fontSize="md">
              </Heading>
            </> : mostSellingItem}
          </Text>
        </Box>
        <Box
          p={"3"}
          borderRadius={"md"}
          borderWidth={1}
          borderColor={"coolGray.200"}
          w={"48"}
        >
          <Text fontSize={"md"}>{t("numberOfOrders")}</Text>
          <Text fontSize={"md"} bold>
            +132
          </Text>
        </Box>
      </HStack>
    </VStack>
  );
};
