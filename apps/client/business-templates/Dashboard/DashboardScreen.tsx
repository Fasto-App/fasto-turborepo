import React, { useEffect, useState } from "react";
import { Box, HStack, Heading, ScrollView, Text, VStack } from "native-base";
import { AreaChart } from "./Graphs/AreaChart";
import { PieChart } from "./Graphs/PieChart";
import { VerticalBar } from "./Graphs/VerticalBar";
import { OrangeBox } from "../../components/OrangeBox";
import { useTranslation } from "next-i18next";
import {
  DateType,
  useGetPaidCheckoutByDateQuery,
  useGetUserInformationQuery,
} from "../../gen/generated";
import { parseToCurrency } from "app-helpers";
import { fieldNameFromStoreName } from "@apollo/client/cache";

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
  return (
    <Box flex={1} shadow={"2"} backgroundColor={"gray.100"}>
      <OrangeBox />
      <VStack space={4} p={4} flex={1}>
        <Panel loading={loading} revenue={parseToCurrency(checkoutData?.getPaidCheckoutByDate?.total)} />
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
          <PieChart />
        </HStack>
      </VStack>
    </Box>
  );
};
const Panel = ({ loading, revenue }: any) => {
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
            {loading ? "Carregando" : revenue}
          </Text>
        </Box>

        <Box
          p={"3"}
          borderRadius={"md"}
          borderWidth={1}
          borderColor={"coolGray.200"}
          w={"48"}
        >
          <Text fontSize={"md"}>{t("MostSellingItem")}</Text>
          <Text fontSize={"md"} bold>
            {"Burbon"}
          </Text>
        </Box>
        <Box
          p={"3"}
          borderRadius={"md"}
          borderWidth={1}
          borderColor={"coolGray.200"}
          w={"48"}
        >
          <Text fontSize={"md"}>{t("NumberOfOrders")}</Text>
          <Text fontSize={"md"} bold>
            +132
          </Text>
        </Box>
      </HStack>
    </VStack>
  );
};
